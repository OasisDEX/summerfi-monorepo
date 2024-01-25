import { StackContext, Api } from 'sst/constructs'
import { addTriggersConfig } from './triggers'
import { addSdkConfig } from './sdk'
import { addMigrationssConfig } from './migrations'

export function API(stackContext: StackContext) {
  const { stack } = stackContext
  const api = new Api(stack, 'api', {
    defaults: {
      function: {},
    },
    routes: {},
  })

  addTriggersConfig({ ...stackContext, api })
  addSdkConfig({ ...stackContext, api })
  addMigrationssConfig({ ...stackContext, api })

  stack.addOutputs({
    ApiEndpoint: api.url,
  })
}
