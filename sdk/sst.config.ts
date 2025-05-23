import { SSTConfig } from 'sst'
import { isPersistentStage, isProductionStage } from './sst-utils'
import { sdkDeployedVersionsMap } from './sst-environment'
import { version as clientPkgVersion } from './sdk-client/bundle/package.json'
import { createBackend } from './create-backend'
import { Api, Bucket } from 'sst/constructs'
import { RemovalPolicy } from 'aws-cdk-lib'

import { config } from 'dotenv'

config({ path: ['../.env', './.env'], debug: true, override: true })

export default {
  config(input) {
    const stage = input.stage ?? process.env.SST_USER
    if (!stage) {
      throw new Error('Please specify stage or set SST_USER env variable')
    }

    return {
      region: `${process.env.AWS_REGION}`,
      profile: `${process.env.AWS_PROFILE}`,
      stage: `sst-${stage}`,
      name: 'sdk',
    }
  },
  stacks(app) {
    if (isPersistentStage(app.stage)) {
      app.setDefaultRemovalPolicy('retain')
    } else {
      app.setDefaultRemovalPolicy('destroy')
    }

    app.stack((context) => {
      const { stack } = context
      // helpers
      // const persistent = isPersistentStage(app.stage)
      const production = isProductionStage(app.stage)

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
          retention: production ? 'one_month' : 'one_day',
        },
      })

      const deployedPaths: string[] = []
      for (const version of deployedVersions) {
        try {
          const { url } = createBackend({
            stack,
            deployedVersion: version,
            production,
            sdkGateway,
            sdkBucket,
          })
          deployedPaths.push(url)
        } catch (error) {
          console.error(`Failed to create backend for version ${version}:`, error)
        }
      }

      stack.addOutputs({
        Stage: app.stage,
        SdkApiUrl: sdkGateway.url,
        DeployedVersions: deployedPaths.join(', '),
      })
    })
  },
} as SSTConfig
