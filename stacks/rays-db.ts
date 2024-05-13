import { RDS } from 'sst/constructs'
import * as cdk from 'aws-cdk-lib'
import { SummerStackContext } from './summer-stack-context'

export function addRaysDb({
  stack,
  vpc,
  isDev,
  isProd,
  isStaging,
}: SummerStackContext): RDS | null {
  if (isDev) {
    console.info('RDS is only created in staging and prod stages')
    return null
  }

  if (!vpc) {
    console.error('VPC and VPC subnets are required for RDS. Please add them to the stack context')
    throw new Error('VPC and VPC subnets are required for RDS')
  }

  const scalingStaging = {
    autoPause: 30, // auto pause after 30 minutes
    minCapacity: 'ACU_2' as const,
    maxCapacity: 'ACU_16' as const,
  }

  const scalingProd = {
    autoPause: false,
    minCapacity: 'ACU_4' as const,
    maxCapacity: 'ACU_32' as const,
  }

  const scalingDev = {
    autoPause: true,
    minCapacity: 'ACU_2' as const,
    maxCapacity: 'ACU_2' as const,
  }

  const scaling = isProd ? scalingProd : isStaging ? scalingStaging : scalingDev

  const rds = new RDS(stack, 'rays-database', {
    engine: 'postgresql13.9',
    defaultDatabaseName: 'rays',
    migrations: 'stacks/node_modules/@summerfi/rays-db/dist/migrations',
    types: {
      camelCase: true,
      path: 'packages/rays-db/src/database-types.ts',
    },
    scaling: {
      autoPause: scaling.autoPause,
      minCapacity: scaling.minCapacity,
    },
    cdk: {
      cluster: {
        vpc: vpc.vpc,
        vpcSubnets: vpc.vpcSubnets,
      },
    },
  })

  const resource = rds.node.defaultChild as cdk.CfnResource
  resource?.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN)

  return rds
}
