import { Api, Function, StackContext } from 'sst/constructs'

export function addEarnProtocolConfig({ stack, api }: StackContext & { api: Api }) {
  const { SDK_API_URL, SUBGRAPH_BASE } = process.env
  if (!SUBGRAPH_BASE) {
    throw new Error('SUBGRAPH_BASE is required to deploy the Earn Protocol functions')
  }
  if (!SDK_API_URL) {
    throw new Error('SDK_API_URL is required to deploy the Earn Protocol functions')
  }

  const getEarnProtocolPortfolioFunction = new Function(stack, 'get-earn-protocol-portfolio', {
    handler: 'summerfi-api/get-earn-protocol-portfolio/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    environment: {
      SDK_API_URL: SDK_API_URL,
      SUBGRAPH_BASE: SUBGRAPH_BASE,
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
  })

  const getEarnProtocolFleetsFunction = new Function(stack, 'get-earn-protocol-fleets', {
    handler: 'summerfi-api/get-earn-protocol-fleets/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    environment: {
      SUBGRAPH_BASE: SUBGRAPH_BASE,
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
  })

  api.addRoutes(stack, {
    'GET /api/earn/portfolio/{address}': getEarnProtocolPortfolioFunction,
    'GET /api/earn/fleets': getEarnProtocolFleetsFunction,
  })
}
