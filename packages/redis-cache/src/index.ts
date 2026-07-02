import { DistributedCache, Logger } from '@summerfi/abstractions'
import { createClient } from 'redis'

export interface RedisConfig {
  url: string
  username?: string
  password?: string
  database?: number
  ttlInSeconds: number
  stage: string
  /**
   * Socket connect timeout in ms. When set, a connection that can't be established within this window fails
   * instead of hanging. Omit to preserve the node-redis default (no explicit connect timeout).
   */
  connectTimeoutMs?: number
  /**
   * Max reconnect attempts before `connect()` gives up and rejects. When set, a permanently unreachable
   * endpoint (e.g. a deleted host that returns NXDOMAIN on every retry) rejects quickly rather than retrying
   * forever. Omit to preserve the node-redis default reconnect behaviour (retries indefinitely).
   */
  maxReconnectAttempts?: number
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
    socket: {
      tls: true,
      ...(config.connectTimeoutMs !== undefined && { connectTimeout: config.connectTimeoutMs }),
      ...(config.maxReconnectAttempts !== undefined && {
        // Returning an Error stops node-redis from retrying and makes connect() reject; a number keeps
        // retrying with that backoff. Without this, a permanently-unreachable host retries forever and
        // connect() never settles.
        reconnectStrategy: (retries: number) =>
          retries >= config.maxReconnectAttempts! // eslint-disable-line @typescript-eslint/no-non-null-assertion
            ? new Error('Redis reconnect attempts exhausted')
            : Math.min(retries * 100, 500),
      }),
    },
  })
    .on('error', (err) => logger.error('Redis Client Error', err))
    .on('ready', () => logger.info('Redis Client Ready'))
    .connect()

  return {
    get: async (key) => {
      const finalKey = `${config.stage}:${key}`
      const element = await client.get(finalKey)
      if (element !== null) {
        logger.info('Cache Hit', { key })
      } else {
        logger.info('Cache Miss', { key })
      }
      return element
    },
    set: async (key, value) => {
      const finalKey = `${config.stage}:${key}`
      await client.set(finalKey, value, { EX: config.ttlInSeconds })
    },
  }
}
