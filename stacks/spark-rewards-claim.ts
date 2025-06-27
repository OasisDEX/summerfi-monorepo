import { Api, Function, StackContext } from 'sst/constructs'

export function addSparkRewardsClaim({ stack, api, app }: StackContext & { api: Api }) {
  const { RPC_GATEWAY, SUBGRAPH_BASE } = process.env
  if (!RPC_GATEWAY) {
    throw new Error('RPC_GATEWAY is required to deploy the spark rewards claim functions')
  }
  if (!SUBGRAPH_BASE) {
    throw new Error('SUBGRAPH_BASE is required to deploy the spark rewards claim functions')
  }

  const sparkRewardsClaims = new Function(stack, 'get-spark-rewards-claims-function', {
    handler: 'summerfi-api/spark-rewards-claim/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    environment: {
      STAGE: app.stage,
      RPC_GATEWAY: RPC_GATEWAY,
      SUBGRAPH_BASE: SUBGRAPH_BASE,
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
  })

  api.addRoutes(stack, {
    'GET /api/spark-rewards-claim': sparkRewardsClaims,
  })
}
