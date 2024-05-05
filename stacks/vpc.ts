import { StackContext } from 'sst/constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as process from 'node:process'
import { VPCContext } from './summer-stack-context'

export function attachVPC({ stack, isDev }: StackContext & { isDev: boolean }): VPCContext | null {
  const { VPC_ID, SECURITY_GROUP_ID } = process.env

  if (isDev) {
    console.info('VPC is not attached in dev stages')
    return null
  }

  if (!VPC_ID || !SECURITY_GROUP_ID) {
    if (!isDev) {
      console.warn(
        'VPC_ID or SECURITY_GROUP_ID are not set, VPC will not be attached to the stack. This is only allowed in dev stages.',
      )
    }
    return null
  }

  const vpcSubnets = {
    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
  }

  const vpc = ec2.Vpc.fromLookup(stack, 'VPC', {
    vpcId: VPC_ID,
  })

  const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-0c4c6acb8cbe23f5f')
  return { vpc, vpcSubnets, securityGroup }
}
