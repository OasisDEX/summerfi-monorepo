import { Api, Function, StackContext } from 'sst/constructs'
import { attachVPC } from './vpc'

export function ExternalAPI(stackContext: StackContext) {
  const { stack } = stackContext
  const isDev = stack.stage.startsWith('dev')
  const isStaging = stack.stage === 'staging'
  const isProd = stack.stage === 'production'

  const apiForPartners = new Api(stack, 'for-partners', {
    defaults: {
      function: {},
    },
    routes: {},
    customDomain:
      isStaging || isProd
        ? {
            domainName: isProd ? 'gateway.summer.fi' : 'gateway.staging.summer.fi',
            hostedZone: isProd ? 'summer.fi' : 'staging.summer.fi',
          }
        : undefined,
  })
  const vpc = attachVPC({ ...stackContext, isDev })

  const { SUBGRAPH_BASE } = process.env
  if (!SUBGRAPH_BASE) {
    throw new Error('SUBGRAPH_BASE is required to deploy the triggers functions')
  }

  const { RPC_GATEWAY } = process.env
  if (!RPC_GATEWAY) {
    throw new Error('RPC_GATEWAY is required to deploy the triggers functions')
  }

  const { EARN_PROTOCOL_DB_CONNECTION_STRING } = process.env
  if (!EARN_PROTOCOL_DB_CONNECTION_STRING) {
    throw new Error(
      'EARN_PROTOCOL_DB_CONNECTION_STRING is required to deploy the campaign data functions',
    )
  }

  const getLockedWeEth = new Function(stack, 'get-locked-weeth', {
    handler: 'external-api/get-collateral-locked-function/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    environment: {
      SUBGRAPH_BASE: SUBGRAPH_BASE,
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
    tracing: 'active',
    disableCloudWatchLogs: false,
    applicationLogLevel: 'INFO',
    systemLogLevel: 'INFO',
  })

  const getProtocolInfo = new Function(stack, 'get-protocol-info', {
    handler: 'external-api/get-protocol-info-function/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    environment: {
      SUBGRAPH_BASE: SUBGRAPH_BASE,
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
      RPC_GATEWAY: RPC_GATEWAY,
      STAGE: stack.stage,
    },
    tracing: 'active',
    disableCloudWatchLogs: false,
    applicationLogLevel: 'INFO',
    systemLogLevel: 'INFO',
  })

  // Optional Redis cache for the /vaults route. Passed through from the deploy env when present; the handler
  // falls back to a noop cache when unset, so the function is fully functional without Redis configured.
  const { REDIS_CACHE_URL, REDIS_CACHE_USER, REDIS_CACHE_PASSWORD } = process.env
  if (REDIS_CACHE_URL) {
    getProtocolInfo.addEnvironment('REDIS_CACHE_URL', REDIS_CACHE_URL)
  }
  if (REDIS_CACHE_USER) {
    getProtocolInfo.addEnvironment('REDIS_CACHE_USER', REDIS_CACHE_USER)
  }
  if (REDIS_CACHE_PASSWORD) {
    getProtocolInfo.addEnvironment('REDIS_CACHE_PASSWORD', REDIS_CACHE_PASSWORD)
  }

  const getCampaignData = new Function(stack, 'get-campaign-data', {
    handler: 'external-api/get-campaign-data-function/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    environment: {
      SUBGRAPH_BASE: SUBGRAPH_BASE,
      EARN_PROTOCOL_DB_CONNECTION_STRING: EARN_PROTOCOL_DB_CONNECTION_STRING,
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
      RPC_GATEWAY: RPC_GATEWAY,
    },
    tracing: 'active',
    disableCloudWatchLogs: false,
    applicationLogLevel: 'INFO',
    systemLogLevel: 'INFO',
    ...(vpc && {
      vpc: vpc.vpc,
      vpcSubnets: {
        subnets: [...vpc.vpc.privateSubnets],
      },
    }),
  })

  apiForPartners.addRoutes(stack, {
    'GET /api/locked-weeth': getLockedWeEth,
    'GET /api/protocol-info/users': getProtocolInfo,
    'POST /api/protocol-info/users': getProtocolInfo,
    'GET /api/protocol-info': getProtocolInfo,
    'GET /api/protocol-info/protocol': getProtocolInfo,
    'GET /api/protocol-info/all-users': getProtocolInfo,
    'GET /api/protocol-info/circulating-supply': getProtocolInfo,
    'GET /api/protocol-info/vaults': getProtocolInfo,
    'GET /api/protocol-info/vaults/{chainId}': getProtocolInfo,
    'GET /api/protocol-info/vaults/{chainId}/{vaultAddress}': getProtocolInfo,
    'GET /api/campaigns/{campaign}/{questNumber}/{walletAddress}': getCampaignData,
  })

  stack.addOutputs({
    PartnerApiEndpoint: apiForPartners.url,
    PartnerApiCustomDomain:
      isStaging || isProd
        ? isProd
          ? 'https://gateway.summer.fi'
          : 'https://gateway.staging.summer.fi'
        : undefined,
  })
}
