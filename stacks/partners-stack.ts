import { Api, Function, StackContext } from 'sst/constructs'

export function ExternalAPI(stackContext: StackContext) {
  const { stack } = stackContext
  const apiForPartners = new Api(stack, 'for-partners', {
    defaults: {
      function: {},
    },
    routes: {},
  })

  const { SUBGRAPH_BASE } = process.env
  if (!SUBGRAPH_BASE) {
    throw new Error('SUBGRAPH_BASE is required to deploy the triggers functions')
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
    },
    tracing: 'active',
    disableCloudWatchLogs: false,
    applicationLogLevel: 'INFO',
    systemLogLevel: 'INFO',
  })

  apiForPartners.addRoutes(stack, {
    'GET /api/locked-weeth': getLockedWeEth,
    'GET /api/protocol-info/users': getProtocolInfo,
    'GET /api/protocol-info/protocol': getProtocolInfo,
    'GET /api/protocol-info/all-users': getProtocolInfo,
  })

  stack.addOutputs({
    PartnerApiEndpoint: apiForPartners.url,
  })
}
