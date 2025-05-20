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
    }
  },
  async run() {
    const { environmentVariables } = await import('./sst-environment')
    const { isProductionStage: isProduction, isPersistentStage } = await import('./sst-utils')
    const { createInfra } = await import('./create-infra')
    const { createBackend } = await import('./create-backend')

    // helpers
    const versionTag = environmentVariables.SDK_VERSION
    const persistent = isPersistentStage($app.stage)
    const production = isProduction($app.stage)

    // create core infrastructure
    const { sdkGateway, sdkRouter } = await createInfra({ production, persistent })

    const backendUrl = await createBackend({
      versionTag,
      production,
      sdkGateway,
    }).then((res) => res.url)

    return {
      Stage: $app.stage,
      SdkBackendUrl: backendUrl,
    }
  },
})
