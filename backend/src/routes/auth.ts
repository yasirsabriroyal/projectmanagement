import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { AppError, ConflictError, UnauthorizedError } from '../lib/errors';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';

const router = Router();

const bootstrapAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  organizationId: z.string().uuid().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /auth/bootstrap-admin - creates first admin user (no users exist) or via BOOTSTRAP_ADMIN_SECRET header
router.post('/bootstrap-admin', async (req, res, next) => {
  try {
    const bootstrapSecret = process.env.BOOTSTRAP_ADMIN_SECRET;
    const headerSecret = req.headers['x-bootstrap-admin-secret'] as string | undefined;

    const userCount = await prisma.user.count();
    const isBootstrapAllowed =
      userCount === 0 ||
      (bootstrapSecret && headerSecret && headerSecret === bootstrapSecret);

    if (!isBootstrapAllowed) {
      throw new AppError(403, 'FORBIDDEN', 'Bootstrap admin creation not allowed. No BOOTSTRAP_ADMIN_SECRET match and users already exist.');
    }

    const body = bootstrapAdminSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw new ConflictError('Email already registered');

    // Ensure a default organization exists
    let org = await prisma.organization.findFirst();
    if (!org) {
      org = await prisma.organization.create({
        data: { name: 'Default Organization', slug: 'default' },
      });
    }

    // Get or create Admin role
    const adminRole = await prisma.role.upsert({
      where: { name: 'Admin' },
      update: {},
      create: { name: 'Admin', description: 'Full system access' },
    });

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          email: body.email,
          passwordHash,
          firstName: body.firstName,
          lastName: body.lastName,
          organizationId: org!.id,
        },
      });
      await tx.userRole.create({ data: { userId: u.id, roleId: adminRole.id } });
      return u;
    });

    const payload = { sub: user.id, email: user.email, organizationId: user.organizationId ?? undefined };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(201).json({
      message: 'Bootstrap admin created successfully',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId: user.organizationId,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/register - requires BOOTSTRAP_MODE or admin permission
router.post('/register', async (req, res, next) => {
  try {
    const bootstrapMode = process.env.BOOTSTRAP_MODE === 'true';

    if (!bootstrapMode) {
      // Check for admin auth
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw new AppError(401, 'UNAUTHORIZED', 'Registration requires admin authorization or BOOTSTRAP_MODE');
      }
    }

    const body = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw new ConflictError('Email already registered');

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
        organizationId: body.organizationId,
      },
      select: { id: true, email: true, firstName: true, lastName: true, organizationId: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const payload = { sub: user.id, email: user.email, organizationId: user.organizationId ?? undefined };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId: user.organizationId,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new UnauthorizedError('Refresh token required');

    const payload = verifyRefreshToken(refreshToken);

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) throw new UnauthorizedError('User not found');

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { token: refreshToken } });

    const newPayload = { sub: user.id, email: user.email, organizationId: user.organizationId ?? undefined };
    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
});

// POST /auth/logout
router.post('/logout', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
