import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { CookieRefreshTokenStrategy } from './strategies/cookieRefreshToken.strategy';
import { Session } from './entities/session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, CookieRefreshTokenStrategy],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    forwardRef(() => UsersModule),
    JwtModule.register({}),
    TypeOrmModule.forFeature([Session]),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
