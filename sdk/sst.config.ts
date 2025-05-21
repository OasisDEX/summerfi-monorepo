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
    }
  },
  async run() {
    const { environmentVariables } = await import('./sst-environment')
    const { isProductionStage: isProduction, isPersistentStage } = await import('./sst-utils')
    const { createInfra } = await import('./create-infra')
    const { createBackend } = await import('./create-backend')

    // get sdk version from sdk-client package.json of current git head
    const { version: packageVersion } = await import('./sdk-client/bundle/package.json')

    // helpers
    const persistent = isPersistentStage($app.stage)
    const production = isProduction($app.stage)

    // create core infrastructure
    const { sdkGateway } = await createInfra({ production, persistent })

    const backendUrls: $util.Output<string>[] = []
    const deployedSdkClientVersions = ['0.4.0', '0.5.0']

    for (const versionTag of deployedSdkClientVersions) {
      const backendUrl = await createBackend({
        versionTag,
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
