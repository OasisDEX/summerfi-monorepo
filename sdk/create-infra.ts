export const createInfra = async ({
  production,
  persistent,
}: {
  production: boolean
  persistent: boolean
}) => {
  let sdkBucket: sst.aws.Bucket | undefined
  let sdkGateway: sst.aws.ApiGatewayV2 | undefined

  // create and deploy new resources for persistent stages
  if (persistent) {
    // bucket
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
    // api
  }
  // reuse existing resources for non-persistent stages
  else {
    // bucket
    sdkBucket = sst.aws.Bucket.get('SdkBucket', 'sdk-sst-development-sdkbucketbucket-bhvkkbnz')
  }

  // api
  sdkGateway = new sst.aws.ApiGatewayV2('SdkGateway', {
    link: [sdkBucket],
    accessLog: {
      retention: production ? '1 month' : '1 day',
    },
  })

  return {
    sdkGateway,
    sdkBucket,
  }
}
