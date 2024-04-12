import { Api, Function, StackContext } from 'sst/constructs'

export function addApyConfig({ stack, api }: StackContext & { api: Api }) {
  const { RPC_GATEWAY, SUBGRAPH_BASE } = process.env
  if (!RPC_GATEWAY) {
    throw new Error('RPC_GATEWAY is required to deploy the migrations functions')
  }

  if (!SUBGRAPH_BASE) {
    throw new Error('SUBGRAPH_BASE is required to deploy the triggers functions')
  }

  const getApyFunction = new Function(stack, 'get-apy-function', {
    handler: 'summerfi-api/get-apy-function/src/index.handler',
    runtime: 'nodejs20.x',
    environment: {
      RPC_GATEWAY: RPC_GATEWAY,
      SUBGRAPH_BASE: SUBGRAPH_BASE,
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
  })

  api.addRoutes(stack, {
    'GET /api/apy/{chainId}/{protocol}': getApyFunction,
  })
}
