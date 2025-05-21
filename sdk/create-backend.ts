export const createBackend = async ({
  production,
  clientVersion,
  sdkGateway,
}: {
  production: boolean
  clientVersion: string
  sdkGateway: sst.aws.ApiGatewayV2
}) => {
  // check with regexp if client version is in format vX.Y.Z
  if (!/^\d+\.\d+\.\d+$/.test(clientVersion)) {
    throw new Error(`Client version tag "${clientVersion}" is not in the format vX.Y.Z`)
  }
  // take first char of clientVersion to derive apiVersion
  const apiVersion = `v${clientVersion.charAt(0)}`
  // check with regexp if api version is in format vX
  if (!/^v\d$/.test(apiVersion)) {
    throw new Error(`API version tag "${apiVersion}" is not in the format vX`)
  }

  const { environmentVariables } = await import('./sst-environment')

  // create and deploy function
  const sdkBackend = new sst.aws.Function(`SdkBackend-v${clientVersion}`, {
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

  const path = `/api/sdk/${apiVersion}`

  sdkGateway.route(`ANY ${path}/{proxy+}`, sdkBackend.arn)

  return {
    url: $interpolate`${sdkGateway.url}${path}`,
  }
}
