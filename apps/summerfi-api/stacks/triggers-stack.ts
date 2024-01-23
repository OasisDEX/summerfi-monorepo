import { StackContext, Api, Function } from 'sst/constructs'

export function API({ stack }: StackContext) {
  const getTriggersFunction = new Function(stack, 'get-triggers-function', {
    handler: 'lib/get-triggers-function/src/index.handler',
    runtime: 'nodejs20.x',
    environment: {
      SUBGRAPH_BASE: process.env.SUBGRAPH_BASE || '',
    },
  })

  const setupTriggerFunction = new Function(stack, 'setup-trigger-function', {
    handler: 'lib/setup-trigger-function/src/index.handler',
    runtime: 'nodejs20.x',
    environment: {
      RPC_GATEWAY: process.env.RPC_GATEWAY || '',
      SKIP_VALIDATION: process.env.SKIP_VALIDATION || 'false',
    },
  })

  const api = new Api(stack, 'api', {
    defaults: {
      function: {},
    },
    routes: {
      'GET /api/triggers': getTriggersFunction,
      'POST /api/triggers/{chainId}/{protocol}/{trigger}': setupTriggerFunction,
    },
  })

  const apiUrl = api.url

  setupTriggerFunction.addEnvironment('GET_TRIGGERS_URL', `${apiUrl}/api/triggers`)

  stack.addOutputs({
    ApiEndpoint: api.url,
  })
}
