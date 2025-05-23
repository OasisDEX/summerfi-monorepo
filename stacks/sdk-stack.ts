import { Api, StackContext } from 'sst/constructs'
import { addSdkConfig } from './sdk-router-lambda'
import { addDistributions } from './sdk-distributions'

export async function SdkAPI(stackContext: StackContext) {
  const { stack } = stackContext
  const api = new Api(stack, 'sdk', {})

  addSdkConfig(stackContext, api)
  const { publicUrl } = await addDistributions(stackContext)

  stack.addOutputs({
    SDKApiEndpoint: api.url + '/api/sdk',
    SDKDistributions: publicUrl,
  })
}
