import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "../modules/auth/auth.service";
import { ROLES_KEY } from "src/lib/decorators/role";
import { Roles } from "src/constants/roles.enum";
import { DrizzleService } from "src/db/drizzle.service";
import { auth } from "src/db/schema";
import { eq } from "drizzle-orm";

@Injectable()
export class RequiredRole implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly drizzleService: DrizzleService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.id) {
            throw new UnauthorizedException("User not authenticated");
        }
        const [userData] = await this.drizzleService.db
            .select({
                role: auth.role,
            })
            .from(auth)
            .where(eq(auth.id, user.id))
            .limit(1);

        const hasRequiredRole = requiredRoles.includes(userData.role as Roles);
        if (!hasRequiredRole) {
            throw new UnauthorizedException("You do not have permission to access this resource");
        }
        return true;
    }
}
