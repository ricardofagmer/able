import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('ableRefreshToken'),
            passReqToCallback: true,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(req, payload: any) {
        const refreshToken = req.body['ableRefreshToken'];
        return { userId: payload.sub, username: payload.username, refreshToken };
    }
}
