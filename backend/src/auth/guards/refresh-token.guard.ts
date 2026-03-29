import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';


/**
 * CustomerAutoRefreshGuard extends the base JWT guard to automatically handle token refreshing.
 *
 * @since v1.8.0
 */
@Injectable()
export class RefreshGuard extends AuthGuard('jwt') {
    public constructor(private readonly authService: AuthService) {
        super();
    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();
        const authHeader = req.headers['authorization'];

        try {
            return (await super.canActivate(context)) as boolean;
        } catch (err) {
            const isExpired = err?.name === 'TokenExpiredError' || authHeader;
            if (isExpired) {
                const refreshToken = req.headers['x-refresh-token'];
                if (!refreshToken || typeof refreshToken !== 'string') 
                    throw new UnauthorizedException('Refresh token missing or invalid');

                const newTokenResponse = await this.authService.refreshAccessToken(refreshToken);

                res.setHeader('x-access-token', newTokenResponse.access_token);

                const newPayload = this.authService.decodeAccessToken(newTokenResponse.access_token);
                if (!newPayload) 
                    throw new UnauthorizedException('Failed to decode refreshed token');
                
                req.user = {
                    userId: newPayload.userId,
                    email: newPayload.email
                };

                return true;
            }
            throw err;
        }
    }
}