import { Database } from './database-types'
import { CamelCasePlugin, Kysely } from 'kysely'
import { DataApiDialect } from 'kysely-data-api'
import { RDSData } from '@aws-sdk/client-rds-data'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'

export interface PgRaysDbConfig {
  connectionString: string
}

export interface DataApiRaysDbConfig {
  secretArn: string
  resourceArn: string
  database: string
  client: RDSData
}

export * from './database-types'

export const getRaysDB = async (
  config: PgRaysDbConfig | DataApiRaysDbConfig,
): Promise<Kysely<Database>> => {
  if ('connectionString' in config) {
    const pg = postgres(config.connectionString)
    return new Kysely<Database>({
      dialect: new PostgresJSDialect({
        postgres: pg,
      }),
      plugins: [new CamelCasePlugin()],
    })
  }

  return new Kysely<Database>({
    dialect: new DataApiDialect({
      mode: 'postgres',
      driver: {
        database: config.database,
        secretArn: config.secretArn,
        resourceArn: config.resourceArn,
        client: config.client,
      },
    }),
    plugins: [new CamelCasePlugin()],
  })
}
