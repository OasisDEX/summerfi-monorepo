import { Function as SSTFunction, FunctionProps } from 'sst/constructs'
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
    EARN_PROTOCOL_DB_CONNECTION_STRING: process.env.EARN_PROTOCOL_DB_CONNECTION_STRING || '',
  }

  const createFunctionConfig = (handler: string): FunctionProps =>
    vpc
      ? {
          handler,
          runtime: 'nodejs20.x',
          environment,
          vpc: vpc.vpc,
          vpcSubnets: {
            subnets: [...vpc.vpc.privateSubnets],
          },
          securityGroups: [vpc.securityGroup],
          timeout: '60 seconds',
        }
      : {
          handler,
          runtime: 'nodejs20.x',
          environment,
          timeout: '60 seconds',
        }

  const getApyFunction = new SSTFunction(
    stack,
    'get-apy-function',
    createFunctionConfig('summerfi-api/get-apy-function/src/index.handler'),
  )

  const getRatesFunction = new SSTFunction(
    stack,
    'get-rates-function',
    createFunctionConfig('summerfi-api/get-rates-function/src/index.handler'),
  )

  const getVaultRatesFunction = new SSTFunction(
    stack,
    'get-vault-rates-function',
    createFunctionConfig('summerfi-api/get-vault-rates-function/src/index.handler'),
  )

  const configureCacheForFunction = (fn: SSTFunction) => {
    if (cache) {
      fn.addToRolePolicy(cache.policyStatement)
      fn.addEnvironment('REDIS_CACHE_URL', cache.url)
    } else {
      if (REDIS_CACHE_URL) {
        fn.addEnvironment('REDIS_CACHE_URL', REDIS_CACHE_URL)
      }
      if (REDIS_CACHE_PASSWORD) {
        fn.addEnvironment('REDIS_CACHE_PASSWORD', REDIS_CACHE_PASSWORD)
      }
      if (REDIS_CACHE_USER) {
        fn.addEnvironment('REDIS_CACHE_USER', REDIS_CACHE_USER)
      }
    }
  }

  configureCacheForFunction(getApyFunction)
  configureCacheForFunction(getRatesFunction)
  configureCacheForFunction(getVaultRatesFunction)

  api.addRoutes(stack, {
    'GET /api/apy/{chainId}/{protocol}': getApyFunction,
    'GET /api/rates/{chainId}': getRatesFunction,
    'GET /api/historicalRates/{chainId}': getRatesFunction,
    'POST /api/vault/rates': getVaultRatesFunction,
    'POST /api/vault/historicalRates': getVaultRatesFunction,
    'POST /api/rates': getRatesFunction,
  })
}
