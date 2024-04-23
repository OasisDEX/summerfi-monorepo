import { DistributedCache, Logger } from '@summerfi/abstractions'
import { createClient } from 'redis'

export interface RedisConfig {
  url: string
  username?: string
  password?: string
  database?: number
  ttlInSeconds: number
}

export async function getRedisInstance(
  config: RedisConfig,
  logger: Logger,
): Promise<DistributedCache> {
  logger.info('Creating Redis Client', { url: config.url })

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
    get: async (key) => {
      const element = await client.get(key)
      if (element !== null) {
        logger.info('Cache Hit', { key })
      } else {
        logger.info('Cache Miss', { key })
      }
      return element
    },
    set: async (key, value) => {
      await client.set(key, value, { EX: config.ttlInSeconds })
    },
  }
}
