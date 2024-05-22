import { Api, StackContext } from 'sst/constructs'
import { addTriggersConfig } from './triggers'
import { addSdkConfig } from './sdk'
import { addMigrationsConfig } from './migrations'
import { addPortfolioConfig } from './portfolio'
import { addMorpho } from './morpho'
import { addApyConfig } from './apy'
import { attachVPC } from './vpc'
import { SummerStackContext } from './summer-stack-context'
import { addRaysConfig } from './rays'
import { addRedis } from './redis'

export function API(stackContext: StackContext) {
  const { stack } = stackContext
  const api = new Api(stack, 'api', {
    defaults: {
      function: {},
    },
    routes: {},
  })

  const isDev = stack.stage.startsWith('dev')
  const isStaging = stack.stage == 'staging'
  const isProd = stack.stage == 'production'

  if (!isDev && !isStaging && !isProd) {
    throw new Error('Invalid stage')
  }

  const vpc = attachVPC({ ...stackContext, isDev })
  const cache = addRedis({ ...stackContext, vpc, isDev })

  const summerContext: SummerStackContext = {
    ...stackContext,
    api,
    vpc,
    cache,
    isDev,
    isProd,
    isStaging,
  }

  addTriggersConfig(summerContext)
  addSdkConfig(summerContext)
  addMigrationsConfig(summerContext)
  addPortfolioConfig(summerContext)
  addMorpho(summerContext)
  addApyConfig(summerContext)
  addRaysConfig(summerContext)

  stack.addOutputs({
    ApiEndpoint: api.url,
  })
}
