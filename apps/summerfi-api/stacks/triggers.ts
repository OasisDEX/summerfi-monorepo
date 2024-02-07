import { Api, Function, StackContext } from 'sst/constructs'

export function addTriggersConfig({ stack, api }: StackContext & { api: Api }) {
  const getTriggersFunction = new Function(stack, 'get-triggers-function', {
    handler: 'lib/get-triggers-function/src/index.handler',
    runtime: 'nodejs20.x',
    environment: {
      SUBGRAPH_BASE: process.env.SUBGRAPH_BASE || '',
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
    tracing: 'active',
    disableCloudWatchLogs: false,
    applicationLogLevel: 'INFO',
    systemLogLevel: 'INFO',
  })

  const setupTriggerFunction = new Function(stack, 'setup-trigger-function', {
    handler: 'lib/setup-trigger-function/src/index.handler',
    runtime: 'nodejs20.x',
    environment: {
      RPC_GATEWAY: process.env.RPC_GATEWAY || '',
      SKIP_VALIDATION: process.env.SKIP_VALIDATION || 'false',
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
    tracing: 'active',
    disableCloudWatchLogs: false,
    applicationLogLevel: 'INFO',
    systemLogLevel: 'INFO',
  })

  api.addRoutes(stack, {
    'GET /api/triggers': getTriggersFunction,
    'POST /api/triggers/{chainId}/{protocol}/{trigger}': setupTriggerFunction,
  })

  const apiUrl = api.url

  setupTriggerFunction.addEnvironment('GET_TRIGGERS_URL', `${apiUrl}/api/triggers`)
}
