import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtGuard } from './jwt/jwt.guard';
import { RolesGuard } from './roles/roles.guard';

@Module({
  imports: [
    UsersModule,

    JwtModule.register({
      secret: 'employee-leave-secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtGuard,
    RolesGuard,
  ],

  exports: [
    AuthService,
    JwtGuard,
    RolesGuard,
    JwtModule,
  ],
})
export class AuthModule {}