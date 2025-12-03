import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils';

const prisma = new PrismaClient();

async function main() {
  const email = 'suyash@gmail.com';
  const password = 'password';
  const hashedPassword = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Suyash',
      role: 'admin',
      hashedPassword,
    },
  });

  console.log('Admin user created!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
