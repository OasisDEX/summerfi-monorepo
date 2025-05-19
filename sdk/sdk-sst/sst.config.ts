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
    const bucket = new sst.aws.Bucket('SdkBucket', {
      access: 'cloudfront',
    })
    // file uploads
    const assetList = ['distribution-1.json', 'named-referrals.json']
    for (const asset of assetList) {
      new aws.s3.BucketObjectv2(asset, {
        bucket: bucket.name,
        key: asset,
        contentType: 'application/json',
        source: $asset('bucket/' + asset),
      })
    }
    // bucket router
    const bucketRouter = new sst.aws.Router('MyRouter', {
      routes: {
        '/api/bucket/*': {
          bucket,
          rewrite: { regex: '^/(.*)$', to: '/$1' },
        },
      },
    })

    // function
    const routerFunction = new sst.aws.Function('SdkRouter', {
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
    const httpApi = new sst.aws.ApiGatewayV2('SdkApi', {
      link: [bucket],
      // domain: {
      //   path: 'v1',
      // },
      accessLog: {
        retention: production ? '1 month' : '1 day',
      },
      transform: {
        stage: {
          name: $app.stage + environmentVariables.SDK_VERSION.replace(/\./g, '-'),
        },
      },
    })
    httpApi.route('ANY /api/sdk/{proxy+}', routerFunction.arn)

    return {
      SdkApi: httpApi.url,
      SdkBucket: bucketRouter.url,
    }
  },
})
