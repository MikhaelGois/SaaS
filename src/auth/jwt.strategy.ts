import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './jwt.constants';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../../../backend/prisma/schema.prisma';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { sub: string; email: string; role: UserRole }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      // This should ideally not happen if the token is valid and user exists
      // But for safety, handle the case where user might have been deleted
      return null;
    }
    // Return the user object, which will be attached to the request object (req.user)
    return { userId: user.id, email: user.email, role: user.role };
  }
}
