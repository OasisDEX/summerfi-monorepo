export const createFunction = async ({
  production,
  versionTag,
  sdkGateway,
}: {
  production: boolean
  versionTag: string
  sdkGateway: sst.aws.ApiGatewayV2
}) => {
  const { environmentVariables } = await import('./sst-dotenv')

  // create and deploy function
  const sdkBackend = new sst.aws.Function('SdkBackend', {
    handler: 'sdk-router-function/src/index.handler',
    runtime: 'nodejs22.x',
    timeout: '30 seconds',
    environment: environmentVariables,
    logging: {
      format: 'json',
    },
    concurrency: {
      provisioned: production ? 10 : undefined,
    },
  })

  const apiVersion = versionTag.slice(0, -2)
  // check with regexp if version is in format vX.Y
  if (!/v\d+\.\d+/.test(apiVersion)) {
    throw new Error('Version tag is not in the format vX.Y')
  }

  sdkGateway.route(`ANY /api/sdk/${apiVersion}/{proxy+}`, sdkBackend.arn)
}
