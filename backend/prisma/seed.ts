import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Full system access' },
  });

  const pmRole = await prisma.role.upsert({
    where: { name: 'PM' },
    update: {},
    create: { name: 'PM', description: 'Project Manager' },
  });

  const accountantRole = await prisma.role.upsert({
    where: { name: 'Accountant' },
    update: {},
    create: { name: 'Accountant', description: 'Financial management' },
  });

  const opsRole = await prisma.role.upsert({
    where: { name: 'Ops' },
    update: {},
    create: { name: 'Ops', description: 'Operations' },
  });

  // Create default permissions
  const permissions = [
    { name: 'projects.read', description: 'Read projects' },
    { name: 'projects.write', description: 'Create/update projects' },
    { name: 'projects.delete', description: 'Delete projects' },
    { name: 'users.read', description: 'Read users' },
    { name: 'users.write', description: 'Create/update users' },
    { name: 'users.delete', description: 'Delete users' },
    { name: 'organizations.read', description: 'Read organizations' },
    { name: 'organizations.write', description: 'Create/update organizations' },
    { name: 'memberships.read', description: 'Read project memberships' },
    { name: 'memberships.write', description: 'Manage project memberships' },
  ];

  const createdPermissions: Record<string, { id: string }> = {};
  for (const perm of permissions) {
    const created = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
    createdPermissions[perm.name] = created;
  }

  // Assign all permissions to Admin
  for (const perm of permissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: createdPermissions[perm.name].id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: createdPermissions[perm.name].id },
    });
  }

  // PM: projects.read/write, memberships.read/write, users.read
  const pmPerms = ['projects.read', 'projects.write', 'memberships.read', 'memberships.write', 'users.read'];
  for (const permName of pmPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: pmRole.id, permissionId: createdPermissions[permName].id } },
      update: {},
      create: { roleId: pmRole.id, permissionId: createdPermissions[permName].id },
    });
  }

  // Accountant: projects.read, users.read
  const accountantPerms = ['projects.read', 'users.read'];
  for (const permName of accountantPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: accountantRole.id, permissionId: createdPermissions[permName].id } },
      update: {},
      create: { roleId: accountantRole.id, permissionId: createdPermissions[permName].id },
    });
  }

  // Ops: projects.read, memberships.read
  const opsPerms = ['projects.read', 'memberships.read'];
  for (const permName of opsPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: opsRole.id, permissionId: createdPermissions[permName].id } },
      update: {},
      create: { roleId: opsRole.id, permissionId: createdPermissions[permName].id },
    });
  }

  // Create default organization
  const org = await prisma.organization.upsert({
    where: { slug: 'default' },
    update: {},
    create: { name: 'Default Organization', slug: 'default' },
  });

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@constructflow.com' },
    update: {},
    create: {
      email: 'admin@constructflow.com',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      organizationId: org.id,
    },
  });

  // Assign admin role
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  console.log('Seed completed successfully');
  console.log('Admin credentials: admin@constructflow.com / Admin123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
