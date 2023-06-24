import { PrismaClient } from "@prisma/client";
import { extensionRedisCache } from "../dist"
import { Redis } from 'ioredis';
import { createCache } from 'async-cache-dedupe';

const DEFAULT_CACHE_TIME = 300;

const redisClient = new Redis();
const cache = createCache({
  storage: {
    type: 'redis',
    options: {
      client: redisClient,
      log: console,
    }
  },
  ttl: DEFAULT_CACHE_TIME,
  onHit: (key: string) => {
    console.log("hit", key);
  },
  onMiss: (key: string) => {
    console.log("miss", key);
  },
  onError: (key: string) => {
    console.log("error", key);
  },
});
const prisma = new PrismaClient().$extends(
  extensionRedisCache({
    cache,
    // example config
    // config: [
    //   { model: 'User', operations: ['findFirst'] },
    //   { model: 'Post', operations: ['findFirst'] }
    // ]
  })
);

prisma.post.

async function main() {
  const user = await prisma.user.findFirst({ where: { id: 1 } });
  const user2 = await prisma.user.findFirst({ where: { id: 1 } })
  const user3 = await prisma.user.findMany({ where: { id: 1 } })

  const post = await prisma.post.findFirst({
    where: {
      OR: [
        { title: { contains: 'prisma' } },
        { content: { contains: 'prisma' } },
      ],
      published: true,
    },
  });

  console.log({ user, post })
}

main()
