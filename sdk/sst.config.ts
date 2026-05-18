import { SSTConfig } from 'sst'
import { isPersistentStage, isProductionStage } from './sst-utils'
import { sdkDeployedVersionsMap } from './sst-environment'
import { version as clientPkgVersion } from './sdk-client/bundle/package.json'
import { createBackend } from './create-backend'
import { Api, Bucket } from 'sst/constructs'
import { RemovalPolicy } from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { config } from '@dotenvx/dotenvx'

config({ path: ['../.env', '.env'], override: true, debug: false, ignore: ['MISSING_ENV_FILE'] })

export default {
  config(input) {
    // AWS CF config
    const stage = input.stage ?? `SST-v2-${process.env.SST_USER}`
    if (!stage) {
      throw new Error('Please specify stage or set SST_USER env variable')
    }

    return {
      region: `${process.env.AWS_REGION}`,
      profile: `${process.env.AWS_PROFILE}`,
      stage: stage, // AWS CF stack name
      name: 'versioned-sdk',
    }
  },
  stacks(app) {
    // AWS CDK stacks
    if (isPersistentStage(app.stage)) {
      app.setDefaultRemovalPolicy('retain')
    } else {
      app.setDefaultRemovalPolicy('destroy')
    }

    app.stack((context) => {
      const { stack } = context
      // helpers
      const persistent = isPersistentStage(app.stage)
      const production = isProductionStage(app.stage)
      const attachDbVpc = app.stage === 'staging' || app.stage === 'production'

      const vpc = (() => {
        if (!attachDbVpc) {
          return null
        }

        const { VPC_ID, SECURITY_GROUP_ID } = process.env
        if (!VPC_ID || !SECURITY_GROUP_ID) {
          throw new Error(
            'VPC_ID and SECURITY_GROUP_ID must be set for staging/production SDK deploys',
          )
        }

        return {
          vpc: ec2.Vpc.fromLookup(stack, 'VPC', { vpcId: VPC_ID }),
          securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', SECURITY_GROUP_ID),
        }
      })()

      const deployedVersions = Object.values(sdkDeployedVersionsMap)

      // check if client version is in deployedSdkApiVersions
      if (!deployedVersions.includes(clientPkgVersion)) {
        throw new Error(
          `Client pkg version ${clientPkgVersion} is not in the list of deployed versions: ${deployedVersions.join(', ')}. Please update SDK_DEPLOYED_VERSIONS_MAP var in GitHub environment with a newly deployed version to allow deployment.`,
        )
      }

      const sdkBucket = new Bucket(stack, 'SdkBucket', {
        cdk: {
          bucket: {
            publicReadAccess: true,
            removalPolicy: RemovalPolicy.DESTROY, // Optional: to clean up the bucket on stack deletion
          },
        },
      })

      const sdkGateway = new Api(stack, 'SdkGateway', {
        accessLog: {
          retention: production ? 'one_month' : persistent ? 'one_week' : 'one_day',
        },
      })

      const deployedPaths: string[] = []
      for (const version of deployedVersions) {
        try {
          const { url } = createBackend({
            stack,
            deployedVersion: version,
            production,
            persistent,
            sdkGateway,
            sdkBucket,
            vpc,
          })
          deployedPaths.push(url)
        } catch (error) {
          console.error(`Failed to create backend for version ${version}:`, error)
        }
      }

      // log some important variables
      console.log('\nVariables:', {
        FUNCTIONS_API_URL: process.env.FUNCTIONS_API_URL,
        PARTNERS_API_URL: process.env.PARTNERS_API_URL,
      })

      stack.addOutputs({
        Stage: app.stage,
        DeployUrl: sdkGateway.url,
        DeployedVersions: deployedPaths.join(', '),
      })
    })
  },
} as SSTConfig
