import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { CreateUserDto } from '../users/dto/create-user.dto'
import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const existingUser = await this.usersService.findUserByUsername(
      createUserDto.username,
    );

    if (existingUser) {
      throw new ConflictException('Пользователь уже зарегистрирован');
    }

    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: hash,
    });

    const registeredUser = {
      id: newUser.id,
      username: newUser.username,
      role: createUserDto.role,
    };
    return registeredUser;
  }

  async signIn(data: AuthDto) {
    if (!data || !data.username || !data.password) {
      throw new BadRequestException('Отсутствуют обязательные поля');
    }

    // Searching for the current user.
    const user = await this.usersService.findUserByUsername(data.username);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Checking the password.
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches) {
      throw new BadRequestException('Некорректный пароль');
    }

    // Mutating the tokens.
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number, refreshToken: string) {
    const session = await this.sessionRepository.findOne({
      where: { userId: userId, refresh_token: refreshToken },
    });

    if (!session) {
      throw new BadRequestException('Сессия не найдена');
    }

    await this.deleteRefreshToken(session.id);
    return { message: 'Сессия успешно удалена' };
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
    sessionId?: string,
  ) {
    if (sessionId) {
      await this.sessionRepository.update(
        { id: sessionId },
        { refresh_token: refreshToken }
      );
    } else {
      await this.sessionRepository.create({
        userId: userId,
        refresh_token: refreshToken,
      });
    }
  }

  async deleteRefreshToken(sessionId: string) {
    await this.sessionRepository.delete({ id: sessionId });
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
    clearRefreshTokenCookie: () => void,
  ) {

    const [user, session] = await Promise.all([
      this.usersService.findUserById(userId, {
        internalCall: true,
      }),
      this.sessionRepository.findOne({
        where: { userId: userId, refresh_token: refreshToken },
      })
    ]);

    if (!session || !refreshToken) {
      clearRefreshTokenCookie();
      throw new ForbiddenException('Доступ запрещен');
    }

    const refreshTokenMatches =
      session.refresh_token === refreshToken;

    if (!refreshTokenMatches) {
      clearRefreshTokenCookie();
      throw new ForbiddenException('Доступ запрещен');
    }

    // Obtaining tokens.
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(
      user.id,
      tokens.refreshToken,
      session.id,
    );

    return tokens;
  }
}
