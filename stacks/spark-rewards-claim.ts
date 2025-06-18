import { Api, Function, StackContext } from 'sst/constructs'

export function addSparkRewardsClaim({ stack, api }: StackContext & { api: Api }) {
  const { RPC_GATEWAY } = process.env
  if (!RPC_GATEWAY) {
    throw new Error('RPC_GATEWAY is required to deploy the spark rewards claim functions')
  }

  const sparkRewardsClaims = new Function(stack, 'get-spark-rewards-claims-function', {
    handler: 'summerfi-api/spark-rewards-claims/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    environment: {
      RPC_GATEWAY: RPC_GATEWAY,
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
  })

  api.addRoutes(stack, {
    'GET /api/spark-rewards-claim': sparkRewardsClaims,
  })
}
