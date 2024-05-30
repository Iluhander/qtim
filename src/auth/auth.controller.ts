import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { decode } from 'js-base64';
import { Request } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Регистрация и аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Зарегистрировать пользователя',
    description: 'Только для роли ADMIN',
  })
  @ApiResponse({ status: 200, description: 'Пользователь создан' })
  @ApiResponse({ status: 409, description: 'Пользователь уже существует' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @ApiOperation({ summary: 'Аутентифицировать пользователя' })
  @ApiResponse({
    status: 200,
    description: `{
      "accessToken": "*",
    }`,
  })
  @ApiResponse({ status: 400, description: '' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка' })
  @Post('signin')
  async signin(
    @Req() req,
    @Body() data: AuthDto,
    @Res({ passthrough: true }) res,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(data);
    const jwtMiddlePart = decode(refreshToken.split('.')[1]);
    const { exp } = JSON.parse(jwtMiddlePart);

    res.cookie('refreshToken', refreshToken, {
      expires: new Date(exp * 1000),
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      path: '/api/auth',
    });
    return { accessToken };
  }

  @ApiOperation({ summary: 'Выйти из системы' })
  @ApiResponse({ status: 200, description: 'Сессия успешно удалена' })
  @ApiResponse({ status: 400, description: 'Сессия не найдена' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка' })
  @UseGuards(RefreshTokenGuard)
  @Get('logout')
  async logout(
    @Req() req: Request,
    @Body() body,
    @Res({ passthrough: true }) res,
  ) {
    const userId = (req as any).user['sub'];
    const refreshToken = (req as any).user['refreshToken'];

    const { message } = await this.authService.logout(userId, refreshToken);

    res.clearCookie('refreshToken');

    return { message };
  }

  @ApiOperation({ summary: 'Обновить accessToken' })
  @ApiResponse({
    status: 200,
    description: `{
      "accessToken": "*",
    }`,
  })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка' })
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Body() body,
    @Res({ passthrough: true }) res,
  ) {
    const userId = (req as any).user['sub'];
    const _refreshToken = (req as any).user['refreshToken'];

    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      userId,
      _refreshToken,
      () => res.clearCookie('refreshToken'),
    );

    const jwtMiddlePart = decode(refreshToken.split('.')[1]);
    const { exp } = JSON.parse(jwtMiddlePart);

    res.cookie('refreshToken', refreshToken, {
      expires: new Date(exp * 1000),
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      path: '/api/auth',
    });

    return { accessToken };
  }
}
