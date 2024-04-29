import { StackContext } from 'sst/constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as process from 'node:process'

export interface VPCContext {
  vpc: ec2.IVpc | undefined
  vpcSubnets: ec2.SubnetSelection | undefined
}

export function attachVPC({ stack, isDev }: StackContext & { isDev: boolean }): VPCContext {
  const { VPC_ID } = process.env

  if (isDev) {
    console.info('VPC is not attached in dev stages')
    return { vpc: undefined, vpcSubnets: undefined }
  }

  if (!VPC_ID) {
    if (!isDev) {
      console.warn(
        'VPC_ID is not set, VPC will not be attached to the stack. This is only allowed in dev stages.',
      )
    }
    return { vpc: undefined, vpcSubnets: undefined }
  }

  const vpcSubnets = {
    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
  }

  const vpc = ec2.Vpc.fromLookup(stack, 'VPC', {
    vpcId: VPC_ID,
  })

  return { vpc, vpcSubnets }
}
