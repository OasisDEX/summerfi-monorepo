/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  async app(input) {
    const { isPersistentStage } = await import('./utils')

    return {
      name: 'sdk-sst',
      removal: isPersistentStage(input?.stage) ? 'retain' : 'remove',
      protect: isPersistentStage(input?.stage),
      home: 'aws',
    }
  },
  async run() {
    const { environmentVariables } = await import('./environment')
    const { isProduction, isPersistentStage } = await import('./utils')

    // helpers
    const production = isProduction($app.stage)
    const persistent = isPersistentStage($app.stage)

    // bucket
    const sdkbucket = new sst.aws.Bucket('SdkBucket', {
      access: 'cloudfront',
      enforceHttps: true,
    })
    // file uploads
    const assetList = ['distribution-1.json', 'named-referrals.json']
    for (const asset of assetList) {
      new aws.s3.BucketObjectv2(asset, {
        bucket: sdkbucket.name,
        key: asset,
        contentType: 'application/json',
        source: $asset('bucket/' + asset),
      })
    }
    // bucket router
    const sdkRouter = new sst.aws.Router('SdkRouter', {
      routes: {
        '/api/bucket/*': {
          bucket: sdkbucket,
          rewrite: {
            regex: '^/api/bucket/(.*)$',
            to: '/$1',
          },
        },
      },
    })

    // function
    const sdkBackend = new sst.aws.Function('SdkBackend', {
      handler: '../sdk-router-function/src/index.handler',
      runtime: 'nodejs20.x',
      timeout: '30 seconds',
      environment: environmentVariables,
      logging: {
        format: 'json',
      },
      concurrency: {
        provisioned: production ? 10 : undefined,
      },
    })

    // api
    const sdkGateway = new sst.aws.ApiGatewayV2('SdkGateway', {
      link: [sdkbucket],
      accessLog: {
        retention: production ? '1 month' : '1 day',
      },
      transform: {
        stage: {
          name: production
            ? $app.stage + environmentVariables.SDK_VERSION.replace(/\./g, '-')
            : $app.stage,
        },
      },
    })
    sdkGateway.route('ANY /api/sdk/{proxy+}', sdkBackend.arn)

    return {
      SdkGateway: sdkGateway.url,
      SdkRouter: sdkRouter.url,
    }
  },
})
