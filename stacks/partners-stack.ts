import { Api, Function, StackContext, use } from 'sst/constructs'
import { attachVPC } from './vpc'
import { API } from './summer-stack'

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

  // Reuse the SST-managed ElastiCache created in the `API` stack (same cache get-rates-function uses) instead
  // of a separate/external Redis. `cache` is null in dev stages (no managed cache) — consumers fall back to a
  // noop cache. This is a cross-stack dependency: `ExternalAPI` deploys after `API`.
  const { cache } = use(API)

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
    // The /vaults route caches in the SST-managed ElastiCache, which is VPC-internal, so the function must run
    // in the VPC to reach it (mirrors get-rates-function and get-campaign-data in this stack). The private
    // subnets have NAT egress, so SUBGRAPH_BASE / RPC_GATEWAY remain reachable.
    ...(vpc && {
      vpc: vpc.vpc,
      vpcSubnets: {
        subnets: [...vpc.vpc.privateSubnets],
      },
      securityGroups: [vpc.securityGroup],
    }),
  })

  // Redis cache for the /vaults route: reuse the SST-managed ElastiCache from the `API` stack (same cache
  // get-rates-function uses). This replaces the previous external Redis Cloud env passthrough. When there is no
  // managed cache (dev stages, `cache === null`) the handler falls back to a noop cache and still works.
  if (cache) {
    getProtocolInfo.addToRolePolicy(cache.policyStatement)
    getProtocolInfo.addEnvironment('REDIS_CACHE_URL', cache.url)
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
