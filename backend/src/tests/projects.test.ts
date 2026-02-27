import request from 'supertest';
import app from '../app';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { signAccessToken } from '../lib/jwt';

let adminToken: string;
let orgId: string;
let userId: string;

beforeAll(async () => {
  // Create org
  const org = await prisma.organization.create({ data: { name: 'Test Org', slug: `test-org-${Date.now()}` } });
  orgId = org.id;

  // Create admin role + permissions if not existing
  const adminRole = await prisma.role.upsert({ where: { name: 'Admin' }, update: {}, create: { name: 'Admin', description: 'Admin' } });

  const perms = ['projects.read', 'projects.write', 'projects.delete'];
  for (const name of perms) {
    const perm = await prisma.permission.upsert({ where: { name }, update: {}, create: { name, description: name } });
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
  }

  // Create test user
  const hash = await bcrypt.hash('TestPass123!', 10);
  const user = await prisma.user.create({
    data: { email: `testprojects-${Date.now()}@example.com`, passwordHash: hash, firstName: 'Test', lastName: 'User', organizationId: orgId },
  });
  userId = user.id;

  await prisma.userRole.create({ data: { userId: user.id, roleId: adminRole.id } });

  adminToken = signAccessToken({ sub: user.id, email: user.email, organizationId: orgId });
});

afterAll(async () => {
  await prisma.project.deleteMany({ where: { organizationId: orgId } });
  await prisma.userRole.deleteMany({ where: { userId } });
  await prisma.user.deleteMany({ where: { id: userId } });
  await prisma.organization.deleteMany({ where: { id: orgId } });
  await prisma.$disconnect();
});

describe('GET /api/v1/projects', () => {
  it('returns 200 with projects list for authenticated user with permission', async () => {
    const res = await request(app)
      .get('/api/v1/projects')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 401 without auth token', async () => {
    const res = await request(app).get('/api/v1/projects');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/projects', () => {
  it('creates a project and returns 201', async () => {
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Project', organizationId: orgId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Project');
  });

  it('returns idempotent response for same Idempotency-Key', async () => {
    const idempKey = `test-idem-${Date.now()}`;
    const payload = { name: 'Idem Project', organizationId: orgId };

    const res1 = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('Idempotency-Key', idempKey)
      .send(payload);

    const res2 = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('Idempotency-Key', idempKey)
      .send(payload);

    expect(res1.status).toBe(201);
    expect(res2.status).toBe(201);
    expect(res1.body.id).toBe(res2.body.id);
  });
});
