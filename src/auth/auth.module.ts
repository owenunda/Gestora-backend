import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule } from '../clients/clients.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config/env.config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ClientsModule,
    PassportModule,
    JwtModule.register({
      secret: EnvConfig.jwtSecret,
      signOptions: { expiresIn: EnvConfig.jwtExpiresIn as any },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
