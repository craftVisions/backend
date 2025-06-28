import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserContext = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
