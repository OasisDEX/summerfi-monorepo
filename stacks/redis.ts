import { CacheContext, SummerStackContext } from './summer-stack-context'
import * as elasticache from 'aws-cdk-lib/aws-elasticache'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as cdk from 'aws-cdk-lib'

export function addRedis({
  stack,
  vpc,
  isDev,
}: Pick<SummerStackContext, 'stack' | 'vpc' | 'isDev'>): CacheContext | null {
  if (isDev) {
    console.info('Redis is not attached in dev stages')
    return null
  }

  if (!vpc) {
    console.error('VPC is required for Redis. Please add it to the stack context')
    throw new Error('VPC is required for Redis')
  }

  const redis = new elasticache.CfnServerlessCache(stack, 'redis-cache', {
    engine: 'redis',
    serverlessCacheName: `${stack.stage}-redis-cache`,
    majorEngineVersion: '7',
    securityGroupIds: [vpc.securityGroup.securityGroupId],
    subnetIds: vpc.vpc.selectSubnets(vpc.vpcSubnets).subnetIds,
  })

  redis.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN)

  const endpoint = redis.attrEndpointAddress
  const port = redis.attrEndpointPort

  const url = 'redis://' + endpoint + ':' + port

  const policyStatement = new iam.PolicyStatement()
  policyStatement.addResources(redis.getAtt('ARN').toString())
  policyStatement.addActions('elasticache:Connect')

  return { instance: redis, url, policyStatement }
}
