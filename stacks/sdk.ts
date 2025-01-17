import { Api, Function, StackContext } from 'sst/constructs'
import { config } from 'dotenv'

config({ path: './sdk/.env', debug: true, override: true })

const {
  SDK_LOGGING_ENABLED = 'false',
  SDK_DEBUG_ENABLED = 'false',
  POWERTOOLS_LOG_LEVEL = 'INFO',
  ONE_INCH_API_KEY,
  ONE_INCH_API_VERSION,
  ONE_INCH_API_URL,
  ONE_INCH_ALLOWED_SWAP_PROTOCOLS = '',
  ONE_INCH_SWAP_CHAIN_IDS,
  ONE_INCH_API_SPOT_URL,
  ONE_INCH_API_SPOT_VERSION,
  ONE_INCH_API_SPOT_KEY,
  RPC_GATEWAY,
  SUBGRAPH_BASE,
  SDK_USE_FORK = '',
  SDK_FORK_CONFIG = '',
  SDK_HUB_CHAIN_ID,
} = process.env

export function addSdkConfig({ stack }: StackContext, api: Api) {
  if (
    !ONE_INCH_API_KEY ||
    !ONE_INCH_API_VERSION ||
    !ONE_INCH_API_URL ||
    !ONE_INCH_SWAP_CHAIN_IDS ||
    !ONE_INCH_API_SPOT_URL ||
    !ONE_INCH_API_SPOT_VERSION ||
    !ONE_INCH_API_SPOT_KEY ||
    !RPC_GATEWAY ||
    !SUBGRAPH_BASE ||
    !SDK_HUB_CHAIN_ID
  ) {
    throw new Error(
      'Some SDK configuration env variables are missing: ' +
        JSON.stringify(
          Object.entries({
            ONE_INCH_API_KEY,
            ONE_INCH_API_VERSION,
            ONE_INCH_API_URL,
            ONE_INCH_SWAP_CHAIN_IDS,
            ONE_INCH_API_SPOT_URL,
            ONE_INCH_API_SPOT_VERSION,
            ONE_INCH_API_SPOT_KEY,
            RPC_GATEWAY,
            SUBGRAPH_BASE,
            SDK_HUB_CHAIN_ID,
          }),
          null,
          2,
        ),
    )
  }

  const sdkRouterFunction = new Function(stack, 'sdk-router-function', {
    handler: 'sdk/sdk-router-function/src/index.handler',
    runtime: 'nodejs20.x',
    logFormat: 'JSON',
    timeout: 30,
    environment: {
      SDK_DEBUG_ENABLED,
      SDK_LOGGING_ENABLED,
      POWERTOOLS_LOG_LEVEL,
      ONE_INCH_API_KEY,
      ONE_INCH_API_VERSION,
      ONE_INCH_API_URL,
      ONE_INCH_ALLOWED_SWAP_PROTOCOLS,
      ONE_INCH_SWAP_CHAIN_IDS,
      ONE_INCH_API_SPOT_URL,
      ONE_INCH_API_SPOT_VERSION,
      ONE_INCH_API_SPOT_KEY,
      RPC_GATEWAY,
      SUBGRAPH_BASE,
      SDK_USE_FORK,
      SDK_FORK_CONFIG,
      SDK_HUB_CHAIN_ID,
    },
  })

  api.addRoutes(stack, {
    'ANY /api/sdk/{proxy+}': sdkRouterFunction,
  })
}
