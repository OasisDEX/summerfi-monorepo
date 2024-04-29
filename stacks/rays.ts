import { SummerStackContext } from './summer-stack-context'
import { Function, RDS } from 'sst/constructs'

export function addRaysConfig({
  stack,
  api,
  db,
  vpc,
  vpcSubnets,
}: SummerStackContext & { db: RDS | null }) {
  const raysFunction =
    vpc && vpcSubnets
      ? new Function(stack, 'get-rays-function', {
          handler: 'summerfi-api/get-rays-function/src/index.handler',
          runtime: 'nodejs20.x',
          logFormat: 'JSON',
          environment: {
            POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
          },
          vpc,
          vpcSubnets,
        })
      : new Function(stack, 'get-rays-function', {
          handler: 'summerfi-api/get-rays-function/src/index.handler',
          runtime: 'nodejs20.x',
          logFormat: 'JSON',
          environment: {
            POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
            RAYS_DB_CONNECTION_STRING:
              process.env.RAYS_DB_CONNECTION_STRING ||
              'postgres://user:password@localhost:5500/rays',
          },
        })

  if (db) {
    raysFunction.bind([db])
  }

  api.addRoutes(stack, {
    'GET /api/rays': raysFunction,
  })
}
