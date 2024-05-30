import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

const extractCookie = (req: Request) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies['refreshToken'];
  }

  return jwt;
};

@Injectable()
export class CookieRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'cookie-jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: extractCookie,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const { refreshToken } = req.cookies;

    return { ...payload, refreshToken };
  }
}
