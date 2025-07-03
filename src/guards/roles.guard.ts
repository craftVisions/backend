import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "../modules/auth/auth.service";
import { ROLES_KEY } from "src/lib/decorators/role";
import { Roles } from "src/constants/roles.enum";
import { DrizzleService } from "src/db/drizzle.service";
import { auth } from "src/db/schema";
import { eq } from "drizzle-orm";
import { CustomException } from "src/lib/exception/custom-exception";

@Injectable()
export class RequiredRole implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log("User in RequiredRole Guard:", user);
        if (!user || !user.role) {
            throw new UnauthorizedException("Unauthorized access");
        }

        const hasRequiredRole = requiredRoles.includes(user.role as Roles);
        if (!hasRequiredRole) {
            throw new CustomException("Forbidden Resource", HttpStatus.FORBIDDEN);
        }
        return true;
    }
}
