import { Api, Function, StackContext } from 'sst/constructs'

export function addMigrationssConfig({ stack, api }: StackContext & { api: Api }) {
  const getMigrationsFunction = new Function(stack, 'get-migrations-function', {
    handler: 'lib/get-migrations-function/src/index.handler',
    runtime: 'nodejs20.x',
    environment: {
      RPC_GATEWAY: process.env.RPC_GATEWAY || '',
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
  })

  api.addRoutes(stack, {
    'GET /api/migrations': getMigrationsFunction,
  })
}
