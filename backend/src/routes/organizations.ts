import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';
import { auditLog } from '../middleware/auditLog';
import { idempotencyMiddleware } from '../middleware/idempotency';
import { NotFoundError } from '../lib/errors';

const router = Router();
router.use(requireAuth);

const orgSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
});

router.get('/', requirePermission('organizations.read'), async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orgs = await prisma.organization.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(orgs);
  } catch (err) { next(err); }
});

router.post('/', requirePermission('organizations.write'), idempotencyMiddleware(), auditLog('organization', 'create'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = orgSchema.parse(req.body);
    const org = await prisma.organization.create({ data: body });
    res.status(201).json(org);
  } catch (err) { next(err); }
});

router.get('/:id', requirePermission('organizations.read'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const org = await prisma.organization.findUnique({ where: { id: req.params.id } });
    if (!org) throw new NotFoundError('Organization');
    res.json(org);
  } catch (err) { next(err); }
});

router.put('/:id', requirePermission('organizations.write'), auditLog('organization', 'update'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = orgSchema.partial().parse(req.body);
    const org = await prisma.organization.update({ where: { id: req.params.id }, data: body });
    res.json(org);
  } catch (err) { next(err); }
});

router.delete('/:id', requirePermission('organizations.write'), auditLog('organization', 'delete'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.organization.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
