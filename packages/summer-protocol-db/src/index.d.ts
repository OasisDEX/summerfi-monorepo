import { Database } from './database-types'
import { Kysely } from 'kysely'
export interface PgSummerProtocolDbConfig {
  connectionString: string
  pool?: {
    min?: number
    max?: number
    idleTimeoutMillis?: number
    acquireTimeoutMillis?: number
  }
}
export interface SummerProtocolDB {
  db: Kysely<Database>
}
export * from './database-types'
export { mapDbNetworkToChainId, mapChainIdToDbNetwork, type DbNetworks } from './helpers'
export type { ExpressionBuilder } from 'kysely'
export declare const getSummerProtocolDB: (
  config: PgSummerProtocolDbConfig,
) => Promise<SummerProtocolDB>
//# sourceMappingURL=index.d.ts.map
