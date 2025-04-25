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
      console.error(
        'VPC_ID or SECURITY_GROUP_ID are not set, VPC will not be attached to the stack. This is only allowed in dev stages.',
      )
      throw new Error('VPC_ID or SECURITY_GROUP_ID are not set')
    }
  }

  const vpc = ec2.Vpc.fromLookup(stack, 'VPC', {
    vpcId: VPC_ID,
  })

  const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', SECURITY_GROUP_ID!)
  return { vpc, securityGroup }
}
