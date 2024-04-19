import { DistributedCache, Logger } from '@summerfi/abstractions'
import { createClient } from 'redis'

export interface RedisConfig {
  url: string
  username: string
  password: string
  database: number
  ttlInSeconds: number
}

export async function getRedisInstance(
  config: RedisConfig,
  logger: Logger,
): Promise<DistributedCache> {
  const client = await createClient({
    url: config.url,
    username: config.username,
    password: config.password,
    database: config.database,
  })
    .on('error', (err) => logger.error('Redis Client Error', err))
    .on('ready', () => logger.info('Redis Client Ready'))
    .connect()

  return {
    get: async (key) => await client.get(key),
    set: async (key, value) => {
      await client.set(key, value, { EX: config.ttlInSeconds })
    },
  }
}
