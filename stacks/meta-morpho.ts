import { Api, Function, StackContext } from 'sst/constructs'

export function addMetaMorpho({ stack, api }: StackContext & { api: Api }) {
  const { RPC_GATEWAY } = process.env
  if (!RPC_GATEWAY) {
    throw new Error('RPC_GATEWAY is required to deploy the migrations functions')
  }

  const getMorphoRewards = new Function(stack, 'get-morpho-rewards-function', {
    handler: 'summerfi-api/get-meta-morpho-details-function/src/index.handler',
    runtime: 'nodejs20.x',
    environment: {
      RPC_GATEWAY: RPC_GATEWAY,
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
  })

  api.addRoutes(stack, {
    'GET /api/meta-morpho': getMorphoRewards,
  })
}
