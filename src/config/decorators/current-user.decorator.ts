import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Principal } from '../../common/principal';

/**
 * Relies on JwtAuthGuard having already populated req.user with a
 * Principal — only works on routes with @UseGuards(JwtAuthGuard).
 * Always returns the FULL Principal object — pull the field you need:
 * @CurrentUser() user -> user.userId
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Principal => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
