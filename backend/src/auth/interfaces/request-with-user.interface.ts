import { Request } from 'express';
import { JwtUserPayload } from '../../auth/dtos/user-payload.dto';

export interface RequestWithUser extends Request {
  user: JwtUserPayload;
}