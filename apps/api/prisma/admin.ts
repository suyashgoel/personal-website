import { PrismaClient } from '@prisma/client';
import { env } from '../src/config';
import { hashPassword } from '../src/utils';

const prisma = new PrismaClient();

const { ADMIN_EMAIL, ADMIN_PASSWORD } = env;

async function main() {
  const email = ADMIN_EMAIL;
  const password = ADMIN_PASSWORD;
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Suyash',
      role: 'admin',
      hashedPassword,
    },
  });

  console.log(`Admin user ready: ${user.email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
