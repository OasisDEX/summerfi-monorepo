export const createInfra = async ({
  production,
  persistent,
}: {
  production: boolean
  persistent: boolean
}) => {
  // bucket
  const sdkBucket = persistent
    ? new sst.aws.Bucket('SdkBucket', {
        access: 'cloudfront',
        enforceHttps: true,
      })
    : sst.aws.Bucket.get('SdkBucket', 'sdk-sst-development-sdkbucketbucket-ktwwvsbo')

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
  const sdkRouter = new sst.aws.Router('SdkRouter', {
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
  const sdkGateway = new sst.aws.ApiGatewayV2('SdkGateway', {
    link: [sdkBucket],
    accessLog: {
      retention: production ? '1 month' : '1 day',
    },
  })

  return {
    sdkGateway,
    sdkRouter,
    sdkBucket,
  }
}
