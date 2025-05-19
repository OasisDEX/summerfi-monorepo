/// <reference path="./.sst/platform/config.d.ts" />

import { format } from 'path'
import { environmentVariables } from './environment'
import { isLongTermStage } from './utils'

export default $config({
  app(input) {
    return {
      name: 'sdk-sst',
      removal: isLongTermStage(input?.stage) ? 'retain' : 'remove',
      protect: isLongTermStage(input?.stage),
      home: 'aws',
    }
  },
  async run() {
    // helpers
    const longTerm = isLongTermStage($app.stage)

    // stack
    const SdkBucket = new sst.aws.Bucket('SdkBucket', {
      enforceHttps: true,
      access: 'public',
    })

    const SdkRouterFunction = new sst.aws.Function('SdkRouter', {
      handler: '../sdk-router-function/src/index.handler',
      runtime: 'nodejs20.x',
      timeout: 30,
      environment: environmentVariables,
      logging: {
        level: 'info',
        format: 'JSON',
      },
    })

    const SdkApi = new sst.aws.ApiGatewayV2('SdkApi', {
      link: [SdkBucket],
      domain: {
        path: 'v1',
      },
      accessLog: {
        retention: longTerm ? '1 month' : '1 day',
      },
      transform: {
        stage: $app.stage + environmentVariables.SDK_VERSION,
      },
    })
    SdkApi.route('ANY /api/sdk/{proxy+}', SdkRouterFunction)
    SdkApi.route('GET /api/bucket/{proxy+}', 'https://' + SdkBucket.name + SdkBucket.domain)

    return {
      SdkApi: SdkApi.url,
    }
  },
})
