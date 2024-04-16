import { Api, StackContext, Function } from 'sst/constructs'
require('dotenv').config({ path: './sdk/.env' })

const {
  POWERTOOLS_LOG_LEVEL = 'INFO',
  ONE_INCH_API_KEY,
  ONE_INCH_API_VERSION,
  ONE_INCH_API_URL,
  ONE_INCH_ALLOWED_SWAP_PROTOCOLS,
  ONE_INCH_SWAP_CHAIN_IDS,
  ONE_INCH_API_SPOT_URL,
  ONE_INCH_API_SPOT_VERSION,
  ONE_INCH_API_SPOT_KEY,
  SDK_LOGGING_ENABLED,
} = process.env

export function addSdkConfig({ stack, api }: StackContext & { api: Api }) {
  if (
    !ONE_INCH_API_KEY ||
    !ONE_INCH_API_VERSION ||
    !ONE_INCH_API_URL ||
    !ONE_INCH_ALLOWED_SWAP_PROTOCOLS ||
    !ONE_INCH_SWAP_CHAIN_IDS ||
    !ONE_INCH_API_SPOT_URL ||
    !ONE_INCH_API_SPOT_VERSION ||
    !ONE_INCH_API_SPOT_KEY
  ) {
    throw new Error(
      'OneInch configuration env variables are missing: ' +
        JSON.stringify(
          Object.entries({
            ONE_INCH_API_KEY,
            ONE_INCH_API_VERSION,
            ONE_INCH_API_URL,
            ONE_INCH_ALLOWED_SWAP_PROTOCOLS,
            ONE_INCH_SWAP_CHAIN_IDS,
            ONE_INCH_API_SPOT_URL,
            ONE_INCH_API_SPOT_VERSION,
            ONE_INCH_API_SPOT_KEY,
          }),
          null,
          2,
        ),
    )
  }

  const sdkRouterFunction = new Function(stack, 'sdk-router-function', {
    handler: 'summerfi-api/sdk-router-function/src/index.handler',
    runtime: 'nodejs20.x',
    environment: {
      POWERTOOLS_LOG_LEVEL,
      ONE_INCH_API_KEY,
      ONE_INCH_API_VERSION,
      ONE_INCH_API_URL,
      ONE_INCH_ALLOWED_SWAP_PROTOCOLS,
      ONE_INCH_SWAP_CHAIN_IDS,
      ONE_INCH_API_SPOT_URL,
      ONE_INCH_API_SPOT_VERSION,
      ONE_INCH_API_SPOT_KEY,
      SDK_LOGGING_ENABLED: SDK_LOGGING_ENABLED!,
    },
  })

  api.addRoutes(stack, {
    'ANY /api/sdk/{proxy+}': sdkRouterFunction,
  })
}
