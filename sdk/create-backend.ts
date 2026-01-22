import { Function, type Api, type Bucket, type Stack } from 'sst/constructs'
import path from 'path'
import { environmentVariables } from './sst-environment'
import { LoggingFormat } from 'aws-cdk-lib/aws-lambda'

export const createBackend = ({
  stack,
  production,
  persistent,
  deployedVersion,
  sdkGateway,
  sdkBucket,
}: {
  stack: Stack
  production: boolean
  persistent: boolean
  deployedVersion: string
  sdkGateway: Api
  sdkBucket: Bucket
}) => {
  // check with regexp if version is in format X.Y.Z
  if (!/^\d+\.\d+\.\d+$/.test(deployedVersion)) {
    throw new Error(`Deployed version tag "${deployedVersion}" is not in the format X.Y.Z`)
  }
  // take first char of deployedVersion to derive apiVersion
  const apiVersion = `v${deployedVersion.charAt(0)}`
  // check with regexp if api version is in format vX
  if (!/^v\d$/.test(apiVersion)) {
    throw new Error(`API version tag "${apiVersion}" is not in the format vX`)
  }

  const nameSuffix = deployedVersion.replaceAll('.', 'x')

  console.log(`ENV FUNCTIONS_API_URL: `, environmentVariables.FUNCTIONS_API_URL)
  console.log(`ENV PARTNERS_API_URL: `, environmentVariables.PARTNERS_API_URL)

  // create and deploy function

  const sdkBackend = new Function(stack, `SdkBackendV${nameSuffix}`, {
    handler: 'sdk-router-function/src/index.handler',
    runtime: 'nodejs22.x',
    timeout: '30 seconds',
    environment: environmentVariables,
    loggingFormat: LoggingFormat.JSON,
    logRetention: production ? 'one_month' : persistent ? 'one_week' : 'one_day',
    currentVersionOptions: {
      provisionedConcurrentExecutions: production ? 10 : undefined,
    },
  })
  sdkBackend.bind([sdkBucket])

  // Create a separate Lambda for OPTIONS
  const optionsHandler = new Function(stack, `SdkOptionsHandlerV${nameSuffix}`, {
    handler: 'sdk-router-function/src/options.handler',
    runtime: 'nodejs22.x',
    timeout: '10 seconds',
    loggingFormat: LoggingFormat.JSON,
    logRetention: production ? 'one_month' : persistent ? 'one_week' : 'one_day',
  })

  const pathOld = `/api/sdk/${apiVersion}` // Old path for backward compatibility
  const path = `/sdk/trpc/${apiVersion}`
  sdkGateway.addRoutes(stack, {
    [`ANY ${pathOld}/{proxy+}`]: sdkBackend,
    [`ANY ${path}/{proxy+}`]: sdkBackend,
    [`OPTIONS ${pathOld}/{proxy+}`]: optionsHandler,
    [`OPTIONS ${path}/{proxy+}`]: optionsHandler,
  })

  return {
    url: `${path}`,
  }
}
