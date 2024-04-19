import { Api, StackContext } from 'sst/constructs'
import { addTriggersConfig } from './triggers'
import { addSdkConfig } from './sdk'
import { addMigrationsConfig } from './migrations'
import { addPortfolioConfig } from './portfolio'
import { addMorpho } from './morpho'
import { addApyConfig } from './apy'

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
  addMorpho({ ...stackContext, api })
  addApyConfig({ ...stackContext, api })

  stack.addOutputs({
    ApiEndpoint: api.url,
  })
}
