import { Api, StackContext } from 'sst/constructs'
import { addSdkConfig } from './sdk'

export function SdkAPI(stackContext: StackContext) {
  const { stack } = stackContext
  const api = new Api(stack, 'sdk', {
    defaults: {
      function: {},
    },
    routes: {},
  })

  addSdkConfig(stackContext, api)

  stack.addOutputs({
    SDKApiEndpoint: api.url + '/api/sdk',
    EarnProtocolApiEndpoint: api.url + '/api/earn-protocol',
  })
}
