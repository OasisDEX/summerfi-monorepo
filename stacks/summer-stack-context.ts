import { Api, StackContext } from 'sst/constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'

export type SummerStackContext = StackContext & {
  api: Api
  vpc: ec2.IVpc | undefined
  vpcSubnets: ec2.SubnetSelection | undefined
  isDev: boolean
  isProd: boolean
  isStaging: boolean
}
