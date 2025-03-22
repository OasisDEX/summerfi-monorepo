import { SummerStackContext } from './summer-stack-context'
import { Cron, Function, FunctionProps } from 'sst/constructs'
import * as process from 'node:process'

export function addSummerEarnAppTablesConfig({ stack, vpc, app, isProd }: SummerStackContext) {
  const { EARN_PROTOCOL_UPDATE_TABLES_AUTH_TOKEN, EARN_APP_URL } = process.env

  if (!EARN_PROTOCOL_UPDATE_TABLES_AUTH_TOKEN) {
    throw new Error('EARN_PROTOCOL_UPDATE_TABLES_AUTH_TOKEN is not set')
  }

  if (!EARN_APP_URL) {
    throw new Error('EARN_APP_URL is not set')
  }

  const commonProps: FunctionProps = {
    runtime: 'nodejs20.x',
    timeout: '100 seconds',
    ...(vpc && {
      vpc: vpc.vpc,
      vpcSubnets: {
        subnets: [...vpc.vpc.privateSubnets],
      },
    }),
  }

  const commonEnvironment = {
    POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    EARN_PROTOCOL_UPDATE_TABLES_AUTH_TOKEN,
    NODE_ENV: app.stage,
    IS_PROD: isProd.toString(),
    EARN_APP_URL,
  }

  const updateLatestActivityTableCronFunctionProps: FunctionProps = {
    handler: 'background-jobs/update-summer-earn-paginated-tables/src/index.latestActivityHandler',
    ...commonProps,
    environment: {
      ...commonEnvironment,
      TABLE_NAME: 'latest-activity',
    },
  }

  const updateTopDepositorsTableCronFunctionProps: FunctionProps = {
    handler: 'background-jobs/update-summer-earn-paginated-tables/src/index.topDepositorsHandler',
    ...commonProps,
    environment: {
      ...commonEnvironment,
      TABLE_NAME: 'top-depositors',
    },
  }

  const updateRebalanceActivityTableCronFunctionProps: FunctionProps = {
    handler:
      'background-jobs/update-summer-earn-paginated-tables/src/index.rebalanceActivityHandler',
    ...commonProps,
    environment: {
      ...commonEnvironment,
      TABLE_NAME: 'rebalance-activity',
    },
  }

  const updateLatestActivityTableCronFunction = new Function(
    stack,
    'update-latest-activity-table-cron-function',
    updateLatestActivityTableCronFunctionProps,
  )

  const updateTopDepositorsTableCronFunction = new Function(
    stack,
    'update-top-depositors-table-cron-function',
    updateTopDepositorsTableCronFunctionProps,
  )

  const updateRebalanceActivityTableCronFunction = new Function(
    stack,
    'update-rebalance-activity-table-cron-function',
    updateRebalanceActivityTableCronFunctionProps,
  )

  new Cron(stack, 'update-latest-activity-table-cron', {
    schedule: 'rate(1 minutes)',
    enabled: false,
    job: updateLatestActivityTableCronFunction,
  })

  new Cron(stack, 'update-top-depositors-table-cron', {
    schedule: 'rate(5 minutes)',
    enabled: false,
    job: updateTopDepositorsTableCronFunction,
  })

  new Cron(stack, 'update-rebalance-activity-table-cron', {
    schedule: 'rate(10 minutes)',
    enabled: false,
    job: updateRebalanceActivityTableCronFunction,
  })
}
