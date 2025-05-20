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
    const { $, chalk, echo } = await import('zx')

    const { environmentVariables } = await import('./sst-dotenv')
    const { isProductionStage: isProduction, isPersistentStage } = await import('./sst-utils')
    const { createInfra } = await import('./create-infra')
    const { createBackend: createFunction } = await import('./create-backend')

    // helpers
    const versionTag = environmentVariables.SDK_VERSION
    const persistent = isPersistentStage($app.stage)
    const production = isProduction($app.stage)

    // create core infrastructure
    const { sdkGateway, sdkRouter } = await createInfra({ production, persistent })

    let backendUrl: string

    // setup persistent stage like staging & prod
    if (persistent && $app.stage !== 'development') {
      // check if version is set in env variables
      if (!versionTag) {
        echo(chalk.red('\nSDK_VERSION is not set in env variables.'))
        process.exit(1)
      }
      // check if version tag exists
      const versionTagExists = await $`git tag --list ${versionTag}`
      if (versionTagExists.stdout.trim() !== versionTag) {
        echo(chalk.red(`\nVersion tag ${versionTag} not found.`))
        process.exit(1)
      }
      // checkout version tag
      await $`git checkout ${versionTag}`

      // install pnpm dependencies after checkout
      await $`pnpm install --prod`
      // build after checkout
      await $`pnpm prebuild:sdk`
      await $`pnpm build:sdk`
      // deploy checked out version of the SDK
      backendUrl = await createFunction({
        versionTag,
        production,
        sdkGateway,
      }).then((res) => res.url)
    } else {
      // setup stage on local machine
      backendUrl = await createFunction({
        versionTag,
        production: false,
        sdkGateway,
      }).then((res) => res.url)
    }

    return {
      Stage: $app.stage,
      SdkBackendUrl: backendUrl,
    }
  },
})
