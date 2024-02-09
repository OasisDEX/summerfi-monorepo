import { Api, StackContext, Function } from 'sst/constructs'

export function addSdkConfig({ stack, api }: StackContext & { api: Api }) {
  const exampleFunction = new Function(stack, 'sdk-demo-function', {
    handler: 'lib/sdk-demo-function/src/index.handler',
    runtime: 'nodejs20.x',
  })

  api.addRoutes(stack, {
    'GET /api/sdk': exampleFunction,
  })
}
