
import { Cache } from 'async-cache-dedupe';

export interface ModelConfig {
  model: string;
  operations: Array<string>
}

export type ExtensionRedisCacheArgs = {
  cache: Cache;
  config?: ModelConfig[]
};