import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * ReqAccountId Decorator Can use with both `@UseGuards(AuthGuard)` and `@UseGuards(AuthOptionalGuard)`.
 * `user` object will inject to `request` in both of these guards and `ReqAccountId` will return the `request.user.id`.
 * Because `AuthGuard` and `AuthOptionalGuard` are using `authSession.getAccount()` and `authSession.getAccountOptional()`.
 * So it is possible to return userId<number> or undefined.
 */
export const ReqAccountId = createParamDecorator((data: unknown, ctx: ExecutionContext): number | undefined => {
    const request = ctx.switchToHttp().getRequest();

    if (request && request.user && request.user.id) {
        return request.user.id;
    }
    return undefined;
});
