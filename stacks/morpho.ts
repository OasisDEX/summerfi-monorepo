import { Api, Function, StackContext } from 'sst/constructs'

export function addMorpho({ stack, api }: StackContext & { api: Api }) {
  const { RPC_GATEWAY } = process.env
  if (!RPC_GATEWAY) {
    throw new Error('RPC_GATEWAY is required to deploy the morpho functions')
  }

  const getMetaMorphoDetails = new Function(stack, 'get-meta-morpho-details-function', {
    handler: 'summerfi-api/get-meta-morpho-details-function/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    environment: {
      RPC_GATEWAY: RPC_GATEWAY,
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
  })

  const morphoClaims = new Function(stack, 'get-morpho-claims-function', {
    handler: 'summerfi-api/get-morpho-claims-function/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    environment: {
      RPC_GATEWAY: RPC_GATEWAY,
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
  })

  api.addRoutes(stack, {
    'GET /api/morpho/meta-morpho': getMetaMorphoDetails,
    'GET /api/morpho/claims': morphoClaims,
  })
}
