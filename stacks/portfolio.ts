import { Api, Function, StackContext } from 'sst/constructs'
import * as process from 'process'

export function addPortfolioConfig({ stack, api }: StackContext & { api: Api }) {
  const { POWERTOOLS_LOG_LEVEL, DEBANK_API_URL, DEBANK_API_KEY } = process.env

  if (!DEBANK_API_URL) {
    throw new Error('DEBANK_API_URL is required to deploy the portfolio functions')
  }
  if (!DEBANK_API_KEY) {
    throw new Error('DEBANK_API_KEY is required to deploy the portfolio functions')
  }

  const getPortfolioAssetsFunction = new Function(stack, 'get-portfolio-assets-function', {
    handler: 'summerfi-api/portfolio-assets-function/src/index.handler',
    runtime: 'nodejs20.x',
    environment: {
      POWERTOOLS_LOG_LEVEL: POWERTOOLS_LOG_LEVEL || 'INFO',
      DEBANK_API_KEY: DEBANK_API_KEY,
      DEBANK_API_URL: DEBANK_API_URL,
    },
  })

  const getPortfolioOverviewFunction = new Function(stack, 'get-portfolio-overview-function', {
    handler: 'summerfi-api/portfolio-overview-function/src/index.handler',
    runtime: 'nodejs20.x',
    environment: {
      POWERTOOLS_LOG_LEVEL: POWERTOOLS_LOG_LEVEL || 'INFO',
      DEBANK_API_KEY: DEBANK_API_KEY,
      DEBANK_API_URL: DEBANK_API_URL,
    },
  })

  api.addRoutes(stack, {
    'GET /api/portfolio/assets': getPortfolioAssetsFunction,
    'GET /api/portfolio/overview': getPortfolioOverviewFunction,
  })
}
