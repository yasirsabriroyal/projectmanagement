import request from 'supertest';
import app from '../app';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

// Setup test user
beforeAll(async () => {
  // Clean up
  await prisma.userRole.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({ where: { email: 'testauth@example.com' } });

  const passwordHash = await bcrypt.hash('TestPass123!', 10);
  await prisma.user.create({
    data: {
      email: 'testauth@example.com',
      passwordHash,
      firstName: 'Test',
      lastName: 'Auth',
    },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'testauth@example.com' } });
  await prisma.$disconnect();
});

describe('POST /api/v1/auth/login', () => {
  it('returns 200 with tokens for valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testauth@example.com', password: 'TestPass123!' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.user.email).toBe('testauth@example.com');
  });

  it('returns 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testauth@example.com', password: 'WrongPassword' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('code', 'UNAUTHORIZED');
  });

  it('returns 422 for invalid request body', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'not-an-email', password: 'pw' });

    expect(res.status).toBe(422);
  });
});
