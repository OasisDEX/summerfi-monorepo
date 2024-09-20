import { Api, Function, StackContext } from 'sst/constructs'
import * as process from 'node:process'

export function addFeeManagerConfig({ stack, api }: StackContext & { api: Api }) {
  const { POWERTOOLS_LOG_LEVEL, SUBGRAPH_BASE } = process.env

  if (!SUBGRAPH_BASE) {
    throw new Error('SUBGRAPH_BASE is required to deploy the fee-manager functions')
  }

  const feeManagerFunction = new Function(stack, 'fee-manager-function', {
    handler: 'summerfi-api/fee-manager-function/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    environment: {
      POWERTOOLS_LOG_LEVEL: POWERTOOLS_LOG_LEVEL || 'INFO',
      SUBGRAPH_BASE: SUBGRAPH_BASE,
    },
  })

  api.addRoutes(stack, {
    'GET /api/fee-manager': feeManagerFunction,
  })
}
