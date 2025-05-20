// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  async app(input) {
    const { isPersistentStage } = await import('./src/sst-utils')

    return {
      name: 'sdk-sst',
      removal: isPersistentStage(input?.stage) ? 'retain' : 'remove',
      protect: isPersistentStage(input?.stage),
      home: 'aws',
    }
  },
  async run() {
    const { $, chalk, echo } = await import('zx')

    const { environmentVariables } = await import('./src/sst-dotenv')
    const { isProductionStage: isProduction, isPersistentStage } = await import('./src/sst-utils')
    const { createInfra } = await import('./src/create-infra')
    const { createFunction } = await import('./src/create-function')

    // helpers
    const versionTag = environmentVariables.SDK_VERSION
    const persistent = isPersistentStage($app.stage)
    const production = isProduction($app.stage)

    // create core infrastructure
    const { sdkGateway, sdkRouter } = await createInfra({ production })

    // setup persistent stage like staging & prod
    if (persistent) {
      // check if version is set in env variables
      if (!versionTag) {
        echo(chalk.red('SDK_VERSION is not set in env variables.'))
        process.exit(1)
      }
      // checkout version tag, throw if not found
      const versionTagExists = await $`git tag --list ${versionTag}`
      if (versionTagExists.stdout.trim() !== versionTag) {
        echo(chalk.red(`Version tag ${versionTag} not found.`))
        process.exit(1)
      }
      // install pnpm dependencies
      await $`pnpm install --prod`
      // build
      await $`pnpm prebuild:sdk`
      await $`pnpm build:sdk`

      createFunction({
        version: versionTag,
        production,
        sdkGateway,
      })
    } else {
      // setup stage on local machine
      createFunction({
        version: versionTag,
        production: false,
        sdkGateway,
      })
    }

    return {
      SdkGateway: sdkGateway.url,
      SdkRouter: sdkRouter.url,
    }
  },
})
