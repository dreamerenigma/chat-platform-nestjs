import { createParamDecorator, ExecutionContext} from '@nestjs/common';
import { AuthenticatedRequst } from './types';

export const AuthUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = <AuthenticatedRequst>ctx.switchToHttp().getRequest();
		return request.user;
	},
);