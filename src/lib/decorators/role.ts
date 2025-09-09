import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Roles } from 'src/constants/roles.enum';
import { RequiredRole } from 'src/guards/roles.guard';

export const ROLES_KEY = 'roles';
export const Role = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);

export const IsAuthorizedAccess = (roles: Roles[]) => {
    return applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        UseGuards(RequiredRole),
    )
}