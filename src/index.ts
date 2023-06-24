import { Prisma } from '@prisma/client/extension'
import { ExtensionRedisCacheArgs } from './types';

export const extensionRedisCache = ({ cache, config }: ExtensionRedisCacheArgs) => {
  return Prisma.defineExtension({
    name: "prisma-extension-redis-cache",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          let result: any;
          const fetchFromPrisma = async (params: typeof args) => {
            return query(params);
          };
          // prevent methods that have not been configured
          if (config && !(config.find(item => item.model === model)?.operations ?? []).includes(operation)) {
            return fetchFromPrisma(args);
          }
          if (!(cache as any)[model]) {
            cache.define(
              model,
              async function modelFetch({ cb, args }) {
                const result = await cb(args);
                return result;
              },
            );
          }
          const cacheFunction = (cache as any)[model];
          try {
            result = await cacheFunction({ cb: query, args });
          } catch (error) {
            result = await fetchFromPrisma(args)
          }
          return result;
        },
      }
    }
  })
};
