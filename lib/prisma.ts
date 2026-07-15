import { PrismaClient } from '@prisma/client';
import { env } from './env';

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      user: {
        async create({ args, query }) {
          const result = await query(args);
          import('./services/sanity-sync.service')
            .then(({ syncUserToSanity }) => syncUserToSanity(result as any))
            .catch(console.error);
          return result;
        },
        async update({ args, query }) {
          const result = await query(args);
          import('./services/sanity-sync.service')
            .then(({ syncUserToSanity }) => syncUserToSanity(result as any))
            .catch(console.error);
          return result;
        },
      },
    },
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
