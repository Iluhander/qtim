import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const res = await this.userRepository.save(dto)
    return res;
  }

  async findUserById(id: number, params?): Promise<User> {
    const { excludePassword = false, internalCall = false } = params;
    const user = await this.userRepository.findOne({
      where: { id },
      ...(excludePassword && {
        attributes: {
          exclude: ['password'],
        },
      }),
    });

    if (!internalCall && !user) {
      throw new BadRequestException('Пользователь не найден');
    }
    return user;
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    return user;
  }
}
