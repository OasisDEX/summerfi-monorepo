import { Api, Function, StackContext } from 'sst/constructs'

export function addMigrationsConfig({ stack, api }: StackContext & { api: Api }) {
  const { RPC_GATEWAY } = process.env
  if (!RPC_GATEWAY) {
    throw new Error('RPC_GATEWAY is required to deploy the migrations functions')
  }

  const getMigrationsFunction = new Function(stack, 'get-migrations-function', {
    handler: 'summerfi-api/get-migrations-function/src/index.handler',
    runtime: 'nodejs20.x',
    environment: {
      RPC_GATEWAY: RPC_GATEWAY,
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
  })

  api.addRoutes(stack, {
    'GET /api/migrations': getMigrationsFunction,
  })
}
