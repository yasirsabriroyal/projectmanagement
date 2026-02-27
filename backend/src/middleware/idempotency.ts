import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { logger } from '../lib/logger';

export function idempotencyMiddleware() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = req.headers['idempotency-key'] as string | undefined;
    if (!key) {
      next();
      return;
    }

    const requestHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({ body: req.body, url: req.url }))
      .digest('hex');

    try {
      const existing = await prisma.idempotencyKey.findUnique({
        where: { key },
      });

      if (existing) {
        if (existing.expiresAt < new Date()) {
          // Expired, delete and continue
          await prisma.idempotencyKey.delete({ where: { key } });
        } else if (existing.requestHash !== requestHash) {
          res.status(422).json({
            code: 'IDEMPOTENCY_CONFLICT',
            message: 'Idempotency key reused with different request body',
          });
          return;
        } else {
          res.status(existing.statusCode).json(existing.responseBody);
          return;
        }
      }

      // Intercept response
      const originalJson = res.json.bind(res);
      res.json = function (body: unknown) {
        // Store idempotency record
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
        prisma.idempotencyKey
          .create({
            data: {
              key,
              requestHash,
              responseBody: body as object,
              statusCode: res.statusCode,
              expiresAt,
            },
          })
          .catch((err) => logger.error('Failed to store idempotency key', { error: err }));

        return originalJson(body);
      };

      next();
    } catch (err) {
      logger.error('Idempotency middleware error', { error: err });
      next();
    }
  };
}
