import { CamelCasePlugin, Kysely, PostgresDialect, sql } from 'kysely'
import { Pool } from 'pg'
export * from './database-types'
export { mapDbNetworkToChainId, mapChainIdToDbNetwork } from './helpers'
export const getSummerProtocolDB = async (config) => {
  const db = new Kysely({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: config.connectionString,
        max: config.pool?.max ?? 10,
        idleTimeoutMillis: config.pool?.idleTimeoutMillis ?? 0,
        connectionTimeoutMillis: config.pool?.acquireTimeoutMillis ?? 30000,
      }),
    }),
    plugins: [new CamelCasePlugin()],
  })
  // Test the connection by executing a simple query
  try {
    await sql`SELECT 1`.execute(db)
  } catch (error) {
    await db.destroy()
    throw new Error(`Failed to connect to earn app database`)
  }
  return {
    db,
  }
}
//# sourceMappingURL=index.js.map
