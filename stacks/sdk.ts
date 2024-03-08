import { Api, StackContext, Function } from 'sst/constructs'

export function addSdkConfig({ stack, api }: StackContext & { api: Api }) {
  const sdkRouterFunction = new Function(stack, 'sdk-router-function', {
    handler: 'summerfi-api/sdk-router-function/src/index.handler',
    runtime: 'nodejs20.x',
  })

  api.addRoutes(stack, {
    'ANY /api/sdk/{proxy+}': sdkRouterFunction,
  })
}
