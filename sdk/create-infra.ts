export const createInfra = async ({
  production,
  persistent,
}: {
  production: boolean
  persistent: boolean
}) => {
  let sdkBucket: sst.aws.Bucket | undefined
  let sdkRouter: sst.aws.Router | undefined
  let sdkGateway: sst.aws.ApiGatewayV2 | undefined

  // create and deploy new resources for persistent stages
  if (persistent) {
    // bucket
    sdkBucket = new sst.aws.Bucket('SdkBucket', {
      access: 'cloudfront',
      enforceHttps: true,
    })
    // file uploads
    const assetList = ['distribution-1.json', 'named-referrals.json']
    for (const asset of assetList) {
      new aws.s3.BucketObjectv2(asset, {
        bucket: sdkBucket.name,
        key: asset,
        contentType: 'application/json',
        source: $asset('bucket/' + asset),
      })
    }
    // bucket router
    sdkRouter = new sst.aws.Router('SdkRouter', {
      routes: {
        '/api/bucket/*': {
          bucket: sdkBucket,
          rewrite: {
            regex: '^/api/bucket/(.*)$',
            to: '/$1',
          },
        },
      },
    })
    // api
    sdkGateway = new sst.aws.ApiGatewayV2('SdkGateway', {
      link: [sdkBucket],
      accessLog: {
        retention: production ? '1 month' : '1 day',
      },
    })
  } else {
    // reuse existing resources for non-persistent stages
    // bucket
    sdkBucket = sst.aws.Bucket.get('SdkBucket', 'sdk-sst-development-sdkbucketbucket-ktwwvsbo')
    // bucket router
    sdkRouter = sst.aws.Router.get('SdkRouter', 'EBO9QCW2ABPU4')
    // api
    sdkGateway = new sst.aws.ApiGatewayV2(
      'SdkGateway',
      {
        link: [sdkBucket],
        accessLog: {
          retention: '1 day',
        },
        transform: {
          stage: {
            name: $app.stage,
          },
        },
      },
      {
        id: 'xd5214to85',
      },
    )
  }
  return {
    sdkGateway,
    sdkRouter,
    sdkBucket,
  }
}
