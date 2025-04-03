import { SummerStackContext } from './summer-stack-context'
import { Cron, Function, FunctionProps } from 'sst/constructs'
import * as process from 'node:process'

export function addSummerProAppProductHubConfig({ stack, vpc, app }: SummerStackContext) {
  const { SUMMER_PRO_PRODUCT_HUB_KEY, PRO_APP_URL } = process.env

  if (!SUMMER_PRO_PRODUCT_HUB_KEY) {
    throw new Error('SUMMER_PRO_PRODUCT_HUB_KEY is not set')
  }

  if (!PRO_APP_URL) {
    throw new Error('PRO_APP_URL is not set')
  }

  const updateProductHubCronFunctionProps: FunctionProps = {
    handler: 'background-jobs/update-summer-pro-product-hub-cron-function/src/index.handler',
    runtime: 'nodejs20.x',
    timeout: '100 seconds',
    environment: {
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
      SUMMER_PRO_PRODUCT_HUB_KEY,
      NODE_ENV: app.stage,
      PRO_APP_URL,
    },
    ...(vpc && {
      vpc: vpc.vpc,
      vpcSubnets: {
        subnets: [...vpc.vpc.privateSubnets],
      },
    }),
  }

  const updateProductHubCronFunction = new Function(
    stack,
    'update-summer-pro-product-hub-cron-function',
    updateProductHubCronFunctionProps,
  )

  new Cron(stack, 'update-summer-pro-product-hub-cron', {
    schedule: 'rate(60 minutes)',
    enabled: true,
    job: updateProductHubCronFunction,
  })
}
