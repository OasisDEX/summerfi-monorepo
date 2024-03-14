import { StackContext, Api } from 'sst/constructs'
import { addTriggersConfig } from './triggers'
import { addSdkConfig } from './sdk'
import { addMigrationsConfig } from './migrations'
import { addPortfolioConfig } from './portfolio'
import { addMetaMorpho } from './meta-morpho'

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
  addMigrationsConfig({ ...stackContext, api })
  addPortfolioConfig({ ...stackContext, api })
  addMetaMorpho({ ...stackContext, api })

  stack.addOutputs({
    ApiEndpoint: api.url,
  })
}
