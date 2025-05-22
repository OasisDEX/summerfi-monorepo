// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  async app(input) {
    const { isPersistentStage } = await import('./sst-utils')

    return {
      name: 'sdk-sst',
      removal: isPersistentStage(input?.stage) ? 'retain' : 'remove',
      // protect: isPersistentStage(input?.stage),
      home: 'aws',
      providers: { aws: '6.81.0' },
    }
  },
  async run() {
    const { isProductionStage: isProduction, isPersistentStage } = await import('./sst-utils')
    const { sdkDeployedApiVersionsMap } = await import('./sst-environment')
    const { createInfra } = await import('./create-infra')
    const { createBackend } = await import('./create-backend')

    // helpers
    const persistent = isPersistentStage($app.stage)
    const production = isProduction($app.stage)

    const deployedSdkApiVersions = Object.values(sdkDeployedApiVersionsMap)
    // get sdk version from sdk-client package.json of current git head
    const { version: clientVersion } = await import('./sdk-client/bundle/package.json')
    // check if client version is in deployedSdkApiVersions
    if (!deployedSdkApiVersions.includes(clientVersion)) {
      throw new Error(
        `Client version ${clientVersion} is not in the list of deployed SDK API versions: ${deployedSdkApiVersions.join(', ')}`,
      )
    }

    // create core infrastructure
    const { sdkGateway } = await createInfra({ production, persistent })

    const backendUrls: $util.Output<string>[] = []
    for (const apiVersion of deployedSdkApiVersions) {
      const backendUrl = await createBackend({
        clientVersion,
        production,
        sdkGateway,
      }).then((res) => res.url)

      backendUrls.push(backendUrl)
    }

    return {
      Stage: $app.stage,
      SdkBackendUrls: backendUrls,
    }
  },
})
