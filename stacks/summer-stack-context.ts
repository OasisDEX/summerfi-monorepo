import { Api, StackContext } from 'sst/constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as elastiCache from 'aws-cdk-lib/aws-elasticache'
import * as iam from 'aws-cdk-lib/aws-iam'

export type CacheContext = {
  instance: elastiCache.CfnServerlessCache
  policyStatement: iam.PolicyStatement
  url: string
}

export interface VPCContext {
  vpc: ec2.IVpc
  securityGroup: ec2.ISecurityGroup
}

export type SummerStackContext = StackContext & {
  api: Api
  cache: CacheContext | null
  vpc: VPCContext | null
  isDev: boolean
  isProd: boolean
  isStaging: boolean
}
