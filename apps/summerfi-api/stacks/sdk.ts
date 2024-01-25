import { Api, StackContext, Function } from 'sst/constructs'

export function addSdkConfig({ stack, api }: StackContext & { api: Api }) {
  const exampleFunction = new Function(stack, 'get-sdk-function', {
    handler: 'lib/sdk-example-function/src/index.handler',
    runtime: 'nodejs20.x',
  })

  api.addRoutes(stack, {
    'GET /api/sdk': exampleFunction,
  })
}
