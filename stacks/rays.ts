import { SummerStackContext } from './summer-stack-context'
import { Cron, Function, FunctionProps, RDS } from 'sst/constructs'
import * as process from 'node:process'

export function addRaysConfig({ stack, api, db, vpc }: SummerStackContext & { db: RDS | null }) {
  const raysFunctionProps: FunctionProps = {
    handler: 'summerfi-api/get-rays-function/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    environment: {
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
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
    environment: {
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
    },
    ...(vpc && {
      vpc: vpc.vpc,
      vpcSubnets: {
        subnets: [...vpc.vpc.privateSubnets],
      },
    }),
  }
  const raysFunction = new Function(stack, 'get-rays-function', raysFunctionProps)
  const updateRaysCronFunction = new Function(
    stack,
    'update-rays-cron-function',
    updateRaysCronFunctionProps,
  )

  new Cron(stack, 'update-rays-cron', {
    schedule: 'rate(2 hours)',
    enabled: process.env.ENABLE_RAYS_UPDATE_CRON === 'true',
    job: updateRaysCronFunction,
  })

  if (db) {
    raysFunction.bind([db])
    updateRaysCronFunction.bind([db])
  } else {
    const connectionString =
      process.env.RAYS_DB_CONNECTION_STRING || 'postgres://user:password@localhost:5500/rays'
    raysFunction.addEnvironment('RAYS_DB_CONNECTION_STRING', connectionString)
    updateRaysCronFunction.addEnvironment('RAYS_DB_CONNECTION_STRING', connectionString)
  }

  api.addRoutes(stack, {
    'GET /api/rays': raysFunction,
  })
}
