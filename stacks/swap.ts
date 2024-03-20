import { Api, Function, StackContext } from 'sst/constructs'

export function addSwap({ stack, api }: StackContext & { api: Api }) {
  const { ONE_INCH_API_URL } = process.env
  if (!ONE_INCH_API_URL) {
    throw new Error('ONE_INCH_API_URL is required to deploy the swap proxy functions')
  }

  const swapProxyFunction = new Function(stack, 'swap-proxy-function', {
    handler: 'summerfi-api/swap-proxy-function/src/index.handler',
    runtime: 'nodejs20.x',
    environment: {
      ONE_INCH_API_URL: ONE_INCH_API_URL,
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
  })

  api.addRoutes(stack, {
    'GET /api/exchange/{proxy+}': swapProxyFunction,
  })
}
