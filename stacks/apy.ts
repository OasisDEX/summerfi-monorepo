import { Api, Function, StackContext } from 'sst/constructs'

export function addApyConfig({ stack, api }: StackContext & { api: Api }) {
  const { RPC_GATEWAY, SUBGRAPH_BASE, REDIS_CACHE_URL } = process.env
  if (!RPC_GATEWAY) {
    throw new Error('RPC_GATEWAY is required to deploy the migrations functions')
  }

  if (!SUBGRAPH_BASE) {
    throw new Error('SUBGRAPH_BASE is required to deploy the triggers functions')
  }

  if (!REDIS_CACHE_URL) {
    console.warn(`REDIS_CACHE_URL is not set, the function will not use cache`)
  }

  const getApyFunction = new Function(stack, 'get-apy-function', {
    handler: 'summerfi-api/get-apy-function/src/index.handler',
    runtime: 'nodejs20.x',
    environment: {
      RPC_GATEWAY: RPC_GATEWAY,
      SUBGRAPH_BASE: SUBGRAPH_BASE,
      REDIS_CACHE_URL: REDIS_CACHE_URL,
      REDIS_CACHE_USER: process.env.REDIS_CACHE_USER,
      REDIS_CACHE_PASSWORD: process.env.REDIS_CACHE_PASSWORD,
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
      STAGE: stack.stage || 'dev',
    },
    // vpc: defaultVpc,
  })

  api.addRoutes(stack, {
    'GET /api/apy/{chainId}/{protocol}': getApyFunction,
  })
}
