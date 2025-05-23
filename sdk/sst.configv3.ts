// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  async app(input) {
    const { isPersistentStage } = await import('./sst-utils')

    return {
      name: 'sdk-sst',
      removal: isPersistentStage(input?.stage) ? 'retain' : 'remove',
      protect: isPersistentStage(input?.stage),
      home: 'aws',
      providers: { aws: '6.81.0' },
    }
  },
  async run() {
    const { isProductionStage: isProduction, isPersistentStage } = await import('./sst-utils')
    const { sdkDeployedVersionsMap } = await import('./sst-environment')
    const { createBackend } = await import('./create-backendv3')

    // helpers
    // const persistent = isPersistentStage($app.stage)
    const production = isProduction($app.stage)

    const deployedVersions = Object.values(sdkDeployedVersionsMap)
    // get sdk version from sdk-client package.json of current git head
    const { version: clientVersion } = await import('./sdk-client/bundle/package.json')
    // check if client version is in deployedSdkApiVersions
    if (!deployedVersions.includes(clientVersion)) {
      throw new Error(
        `Client version ${clientVersion} is not in the list of deployed versions: ${deployedVersions.join(', ')}. Please update SDK_DEPLOYED_VERSIONS_MAP var in GitHub environment with a newly deployed version to allow deployment.`,
      )
    }
    let sdkBucket: sst.aws.Bucket | undefined
    sdkBucket = new sst.aws.Bucket('SdkBucket', {
      access: 'public',
      enforceHttps: true,
    })
    // file uploads
    const assetList = ['distribution-1.json', 'named-referrals.json']
    for (const asset of assetList) {
      new aws.s3.BucketObjectv2(asset, {
        bucket: sdkBucket.name,
        source: $asset('bucket/' + asset),
        key: asset,
        contentType: 'application/json',
      })
    }

    let sdkGateway: sst.aws.ApiGatewayV2 | undefined
    sdkGateway = new sst.aws.ApiGatewayV2('SdkGateway', {
      // link: [sdkBucket],
      accessLog: {
        retention: production ? '1 month' : '1 day',
      },
    })

    const backendUrls: $util.Output<string>[] = []
    for (const version of deployedVersions) {
      try {
        const backendUrl = await createBackend({
          deployedVersion: version,
          production,
          sdkGateway,
        }).then((res) => res.url)
        backendUrls.push(backendUrl)
      } catch (error) {
        console.error(`Failed to create backend for version ${version}:`, error)
        throw error
      }
    }

    return {
      Stage: $app.stage,
      SdkBackendUrls: backendUrls,
    }
  },
})
