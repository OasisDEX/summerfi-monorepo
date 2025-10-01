import { Api, StackContext } from 'sst/constructs'
import { addTriggersConfig } from './triggers'
import { addMigrationsConfig } from './migrations'
import { addPortfolioConfig } from './portfolio'
import { addMorpho } from './morpho'
import { addApyConfig } from './apy'
import { attachVPC } from './vpc'
import { SummerStackContext } from './summer-stack-context'
import { addRedis } from './redis'
import { addSummerProtocolConfig } from './summer-protocol'
import { addSummerEarnAppTablesConfig } from './summer-earn-app-tables'
import { addSummerProAppProductHubConfig } from './summer-pro-app-product-hub'
import { addSparkRewardsClaim } from './spark-rewards-claim'

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
  addMigrationsConfig(summerContext)
  addPortfolioConfig(summerContext)
  addMorpho(summerContext)
  addApyConfig(summerContext)
  addSummerProtocolConfig(summerContext)
  addSummerEarnAppTablesConfig(summerContext)
  addSummerProAppProductHubConfig(summerContext)
  addSparkRewardsClaim(summerContext)

  stack.addOutputs({
    ApiEndpoint: api.url,
  })
}
