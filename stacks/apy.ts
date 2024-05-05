import { Function, FunctionProps } from 'sst/constructs'
import { SummerStackContext } from './summer-stack-context'

export function addApyConfig({ stack, api, vpc, cache }: SummerStackContext) {
  const { RPC_GATEWAY, SUBGRAPH_BASE, REDIS_CACHE_URL, REDIS_CACHE_PASSWORD, REDIS_CACHE_USER } =
    process.env
  if (!RPC_GATEWAY) {
    throw new Error('RPC_GATEWAY is required to deploy the migrations functions')
  }

  if (!SUBGRAPH_BASE) {
    throw new Error('SUBGRAPH_BASE is required to deploy the triggers functions')
  }

  if (!REDIS_CACHE_URL) {
    console.warn(`REDIS_CACHE_URL is not set, the function will not use cache`)
  }

  const environment: Record<string, string> = {
    RPC_GATEWAY: RPC_GATEWAY,
    SUBGRAPH_BASE: SUBGRAPH_BASE,
    POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    STAGE: stack.stage || 'dev',
  }
  const functionConfig: FunctionProps = vpc
    ? {
        handler: 'summerfi-api/get-apy-function/src/index.handler',
        runtime: 'nodejs20.x',
        environment,
        vpc: vpc.vpc,
        vpcSubnets: vpc.vpcSubnets,
        securityGroups: [vpc.securityGroup],
      }
    : {
        handler: 'summerfi-api/get-apy-function/src/index.handler',
        runtime: 'nodejs20.x',
        environment,
      }

  const getApyFunction = new Function(stack, 'get-apy-function', functionConfig)

  if (cache) {
    getApyFunction.addToRolePolicy(cache.policyStatement)
    getApyFunction.addEnvironment('REDIS_CACHE_URL', cache.url)
  } else {
    if (REDIS_CACHE_URL) {
      getApyFunction.addEnvironment('REDIS_CACHE_URL', REDIS_CACHE_URL)
    }

    if (REDIS_CACHE_PASSWORD) {
      getApyFunction.addEnvironment('REDIS_CACHE_PASSWORD', REDIS_CACHE_PASSWORD)
    }

    if (REDIS_CACHE_USER) {
      getApyFunction.addEnvironment('REDIS_CACHE_USER', REDIS_CACHE_USER)
    }
  }

  api.addRoutes(stack, {
    'GET /api/apy/{chainId}/{protocol}': getApyFunction,
  })
}
