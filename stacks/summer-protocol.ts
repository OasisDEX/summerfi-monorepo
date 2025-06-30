import { SummerStackContext } from './summer-stack-context'
import { Cron, Function, FunctionProps } from 'sst/constructs'
import * as process from 'node:process'

export function addSummerProtocolConfig({ stack, vpc, app }: SummerStackContext) {
  const {
    EARN_PROTOCOL_DB_CONNECTION_STRING,
    SUBGRAPH_BASE,
    BEACH_CLUB_REWARDS_DB_CONNECTION_STRING,
    TALLY_API_KEY,
  } = process.env

  if (!EARN_PROTOCOL_DB_CONNECTION_STRING) {
    throw new Error('EARN_PROTOCOL_DB_CONNECTION_STRING is not set')
  }
  if (!SUBGRAPH_BASE) {
    throw new Error('SUBGRAPH_BASE is not set')
  }
  if (!BEACH_CLUB_REWARDS_DB_CONNECTION_STRING) {
    throw new Error('BEACH_CLUB_REWARDS_DB_CONNECTION_STRING is not set')
  }

  if (!TALLY_API_KEY) {
    throw new Error('TALLY_API_KEY is not set')
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

  const updateBeachClubRewardsFunction = new Function(stack, 'update-beach-club-rewards-function', {
    handler: 'background-jobs/update-beach-club-rewards-function/src/index.handler',
    runtime: 'nodejs20.x',
    timeout: '500 seconds',
    environment: {
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
      BEACH_CLUB_REWARDS_DB_CONNECTION_STRING,
    },
    ...(vpc && {
      vpc: vpc.vpc,
      vpcSubnets: {
        subnets: [...vpc.vpc.privateSubnets],
      },
    }),
  })

  const updateTallyDelegatesFunction = new Function(stack, 'update-tally-delegates-function', {
    handler: 'background-jobs/update-tally-delegates/src/index.handler',
    runtime: 'nodejs20.x',
    timeout: '500 seconds',
    environment: {
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
      EARN_PROTOCOL_DB_CONNECTION_STRING,
      TALLY_API_KEY,
    },
    ...(vpc && {
      vpc: vpc.vpc,
      vpcSubnets: {
        subnets: [...vpc.vpc.privateSubnets],
      },
    }),
  })

  new Cron(stack, 'update-beach-club-rewards-cron', {
    schedule: 'rate(1 hour)',
    enabled: true,
    job: updateBeachClubRewardsFunction,
  })

  new Cron(stack, 'update-tally-delegates-cron', {
    schedule: 'rate(1 hour)',
    enabled: true,
    job: updateTallyDelegatesFunction,
  })
}
