import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../lib/jwt';
import { UnauthorizedError } from '../lib/errors';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = authHeader.slice(7);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}
