import { SummerStackContext } from './summer-stack-context'
import { Cron, Function, FunctionProps, RDS } from 'sst/constructs'
import * as process from 'node:process'
import * as rds from 'aws-cdk-lib/aws-rds'
import * as secretsManager from 'aws-cdk-lib/aws-secretsmanager'

export function addRaysConfig({ stack, api, vpc, app }: SummerStackContext) {
  const { SUBGRAPH_BASE, BORROW_DB_READ_CONNECTION_STRING } = process.env

  if (!BORROW_DB_READ_CONNECTION_STRING) {
    throw new Error('BORROW_DB_READ_CONNECTION_STRING is not set')
  }

  if (!SUBGRAPH_BASE) {
    throw new Error('SUBGRAPH_BASE is not set')
  }
  const db = new RDS(stack, 'Database', {
    engine: 'postgresql16.1',
    defaultDatabaseName: 'rays',
    migrations: 'migrations/rays',
    types: 'types/raysDb',
    cdk: {
      cluster: rds.ServerlessCluster.fromServerlessClusterAttributes(stack, 'RaysCluster', {
        clusterIdentifier:
          app.stage == 'staging' ? 'staging-rays-db-cluster' : 'prod-rays-db-cluster',
      }),
      secret: secretsManager.Secret.fromSecretAttributes(stack, 'ISecret', {
        secretPartialArn:
          app.stage == 'staging'
            ? 'arn:aws:secretsmanager:us-east-1:189194422115:secret:rds!cluster-ffe82907-cea7-42b2-8483-01f2a556f528-p5Gzot'
            : 'arn:aws:secretsmanager:us-east-1:189194422115:secret:rds!cluster-b47de7b4-1c9b-4ccb-8031-63d643181faa-cv9ssq',
      }),
      ...(vpc && {
        vpc: vpc.vpc,
        vpcSubnets: {
          subnets: [...vpc.vpc.privateSubnets],
        },
      }),
    },
  })

  // Construct the connection string
  const raysDbConnectionString = `postgresql://${db.cdk.cluster.secret?.secretValueFromJson('username')}:
${db.cdk.cluster.secret?.secretValueFromJson('password')}@${db.cdk.cluster.clusterEndpoint.hostname}:5432/${db.defaultDatabaseName}`

  const raysFunctionProps: FunctionProps = {
    handler: 'summerfi-api/get-rays-function/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    environment: {
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
      RAYS_DB_CONNECTION_STRING: raysDbConnectionString,
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
      RAYS_DB_CONNECTION_STRING: raysDbConnectionString,
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
    timeout: '600 seconds',
    environment: {
      POWERTOOLS_LOG_LEVEL: process.env.POWERTOOLS_LOG_LEVEL || 'INFO',
      RAYS_DB_CONNECTION_STRING: raysDbConnectionString,
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
