export const createFunction = async ({
  production,
  version,
  sdkGateway,
}: {
  production: boolean
  version: string
  sdkGateway: sst.aws.ApiGatewayV2
}) => {
  const { environmentVariables } = await import('./sst-dotenv')

  // create and deploy function
  const sdkBackend = new sst.aws.Function('SdkBackend', {
    handler: 'src/index.handler',
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
  sdkGateway.route(`ANY /api/sdk/${version}/{proxy+}`, sdkBackend.arn)
}
