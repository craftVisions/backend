import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [AuthService, UserService, JwtService],
})
export class AuthModule {}
