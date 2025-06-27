import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PassportModule],
  controllers: [UserController],
  providers: [JwtService, UserService],
})
export class UserModule {}
