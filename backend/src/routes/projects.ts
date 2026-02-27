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

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional(),
  organizationId: z.string().uuid(),
});

const membershipSchema = z.object({
  userId: z.string().uuid(),
  role: z.string().default('member'),
});

router.get('/', requirePermission('projects.read'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orgId = req.query.organizationId as string | undefined;
    const projects = await prisma.project.findMany({
      where: orgId ? { organizationId: orgId } : undefined,
      include: { organization: { select: { id: true, name: true } }, _count: { select: { memberships: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (err) { next(err); }
});

router.post('/', requirePermission('projects.write'), idempotencyMiddleware(), auditLog('project', 'create'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = projectSchema.parse(req.body);
    const project = await prisma.project.create({
      data: body,
      include: { organization: { select: { id: true, name: true } } },
    });
    res.status(201).json(project);
  } catch (err) { next(err); }
});

router.get('/:id', requirePermission('projects.read'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { organization: { select: { id: true, name: true } }, memberships: { include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } } } },
    });
    if (!project) throw new NotFoundError('Project');
    res.json(project);
  } catch (err) { next(err); }
});

router.put('/:id', requirePermission('projects.write'), auditLog('project', 'update'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = projectSchema.partial().parse(req.body);
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: body,
    });
    res.json(project);
  } catch (err) { next(err); }
});

router.delete('/:id', requirePermission('projects.delete'), auditLog('project', 'delete'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) { next(err); }
});

// Memberships
router.get('/:id/memberships', requirePermission('memberships.read'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const memberships = await prisma.projectMembership.findMany({
      where: { projectId: req.params.id },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });
    res.json(memberships);
  } catch (err) { next(err); }
});

router.post('/:id/memberships', requirePermission('memberships.write'), idempotencyMiddleware(), auditLog('membership', 'create'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = membershipSchema.parse(req.body);
    const membership = await prisma.projectMembership.upsert({
      where: { projectId_userId: { projectId: req.params.id, userId: body.userId } },
      update: { role: body.role },
      create: { projectId: req.params.id, userId: body.userId, role: body.role },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });
    res.status(201).json(membership);
  } catch (err) { next(err); }
});

router.delete('/:id/memberships/:userId', requirePermission('memberships.write'), auditLog('membership', 'delete'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.projectMembership.delete({
      where: { projectId_userId: { projectId: req.params.id, userId: req.params.userId } },
    });
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
