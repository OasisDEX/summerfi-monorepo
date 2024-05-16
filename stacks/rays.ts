import { SummerStackContext } from './summer-stack-context'
import { Cron, Function, FunctionProps } from 'sst/constructs'
import * as process from 'node:process'

export function addRaysConfig({ stack, api, vpc }: SummerStackContext) {
  const { RAYS_DB_CONNECTION_STRING, SUBGRAPH_BASE } = process.env
  if (!RAYS_DB_CONNECTION_STRING) {
    throw new Error('RAYS_DB_CONNECTION_STRING is not set')
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
      RAYS_DB_CONNECTION_STRING,
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
      RAYS_DB_CONNECTION_STRING,
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

  api.addRoutes(stack, {
    'GET /api/rays': raysFunction,
  })
}
