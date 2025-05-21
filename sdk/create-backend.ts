export const createBackend = async ({
  production,
  versionTag,
  sdkGateway,
}: {
  production: boolean
  versionTag: string
  sdkGateway: sst.aws.ApiGatewayV2
}) => {
  const { environmentVariables } = await import('./sst-environment')

  // create and deploy function
  const sdkBackend = new sst.aws.Function(`SdkBackend-v${versionTag}`, {
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
  if (!/^\d+\.\d+$/.test(apiVersion)) {
    throw new Error('Version tag is not in the format vX.Y')
  }
  const path = `/api/sdk/v${apiVersion}`

  sdkGateway.route(`ANY ${path}/{proxy+}`, sdkBackend.arn)

  return {
    url: $interpolate`${sdkGateway.url}${path}`,
  }
}
