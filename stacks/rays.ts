import { SummerStackContext } from './summer-stack-context'
import { Cron, Function, FunctionProps } from 'sst/constructs'
import * as process from 'node:process'

export function addRaysConfig({ stack, api, vpc, app }: SummerStackContext) {
  const {
    RAYS_DB_WRITE_CONNECTION_STRING,
    RAYS_DB_READ_CONNECTION_STRING,
    SUBGRAPH_BASE,
    BORROW_DB_READ_CONNECTION_STRING,
  } = process.env

  if (!BORROW_DB_READ_CONNECTION_STRING) {
    throw new Error('BORROW_DB_READ_CONNECTION_STRING is not set')
  }
  if (!RAYS_DB_WRITE_CONNECTION_STRING) {
    throw new Error('RAYS_DB_WRITE_CONNECTION_STRING is not set')
  }
  if (!RAYS_DB_READ_CONNECTION_STRING) {
    throw new Error('RAYS_DB_READ_CONNECTION_STRING is not set')
  }
  if (!SUBGRAPH_BASE) {
    throw new Error('SUBGRAPH_BASE is not set')
  }

  const raysFunctionProps: FunctionProps = {
    handler: 'summerfi-api/get-rays-function/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    environment: {
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
      RAYS_DB_CONNECTION_STRING: RAYS_DB_READ_CONNECTION_STRING,
      BORROW_DB_READ_CONNECTION_STRING: BORROW_DB_READ_CONNECTION_STRING,
    },
    ...(vpc && {
      vpc: vpc.vpc,
      vpcSubnets: {
        subnets: [...vpc.vpc.privateSubnets],
      },
    }),
  }

  const raysLeaderBoardFunctionProps: FunctionProps = {
    handler: 'summerfi-api/get-rays-leaderboard-function/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    environment: {
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
      RAYS_DB_CONNECTION_STRING: RAYS_DB_READ_CONNECTION_STRING,
    },
    ...(vpc && {
      vpc: vpc.vpc,
      vpcSubnets: {
        subnets: [...vpc.vpc.privateSubnets],
      },
    }),
  }

  const updateRaysCronFunctionProps: FunctionProps = {
    handler: 'background-jobs/update-rays-cron-function/src/index.handler',
    runtime: 'nodejs20.x',
    timeout: '300 seconds',
    environment: {
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
      RAYS_DB_CONNECTION_STRING: RAYS_DB_WRITE_CONNECTION_STRING,
      BORROW_DB_READ_CONNECTION_STRING: BORROW_DB_READ_CONNECTION_STRING,
      SUBGRAPH_BASE,
    },
    ...(vpc && {
      vpc: vpc.vpc,
      vpcSubnets: {
        subnets: [...vpc.vpc.privateSubnets],
      },
    }),
  }
  const raysFunction = new Function(stack, 'get-rays-function', raysFunctionProps)
  const raysLeaderBoardFunction = new Function(
    stack,
    'get-rays-leaderboard-function',
    raysLeaderBoardFunctionProps,
  )
  const updateRaysCronFunction = new Function(
    stack,
    'update-rays-cron-function',
    updateRaysCronFunctionProps,
  )

  new Cron(stack, 'update-rays-cron', {
    schedule: 'rate(2 hours)',
    enabled: app.stage === 'staging', // only run in staging right now.
    job: updateRaysCronFunction,
  })

  api.addRoutes(stack, {
    'GET /api/rays': raysFunction,
    'GET /api/rays/leaderboard': raysLeaderBoardFunction,
  })
}
