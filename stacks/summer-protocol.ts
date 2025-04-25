import { SummerStackContext } from './summer-stack-context'
import { Cron, Function, FunctionProps } from 'sst/constructs'
import * as process from 'node:process'

export function addSummerProtocolConfig({ stack, vpc, app }: SummerStackContext) {
  const { EARN_PROTOCOL_DB_CONNECTION_STRING, SUBGRAPH_BASE } = process.env

  if (!EARN_PROTOCOL_DB_CONNECTION_STRING) {
    throw new Error('EARN_PROTOCOL_DB_CONNECTION_STRING is not set')
  }
  if (!SUBGRAPH_BASE) {
    throw new Error('SUBGRAPH_BASE is not set')
  }

  const updateEarnRewardsAprCronFunctionProps: FunctionProps = {
    handler: 'background-jobs/update-summer-earn-rewards-apr/src/index.handler',
    runtime: 'nodejs20.x',
    timeout: '100 seconds',
    environment: {
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
      EARN_PROTOCOL_DB_CONNECTION_STRING,
      SUBGRAPH_BASE,
      NODE_ENV: app.stage,
    },
    ...(vpc && {
      vpc: vpc.vpc,
      vpcSubnets: {
        subnets: [...vpc.vpc.privateSubnets],
      },
    }),
  }

  const updateEarnRewardsAprCronFunction = new Function(
    stack,
    'update-earn-rewards-apr-cron-function',
    updateEarnRewardsAprCronFunctionProps,
  )

  new Cron(stack, 'update-earn-rewards-apr-cron', {
    schedule: 'rate(10 minutes)',
    enabled: true,
    job: updateEarnRewardsAprCronFunction,
  })
}
