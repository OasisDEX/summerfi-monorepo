import { Api, Function, StackContext } from 'sst/constructs'
import { config } from 'dotenv'

config({ path: './sdk/.env', debug: true, override: true })

const {
  SDK_LOGGING_ENABLED = 'false',
  SDK_DEBUG_ENABLED = 'false',
  POWERTOOLS_LOG_LEVEL = 'INFO',
  COINGECKO_API_URL,
  COINGECKO_API_VERSION,
  COINGECKO_API_KEY,
  COINGECKO_API_AUTH_HEADER,
  COINGECKO_SUPPORTED_CHAIN_IDS,
  ONE_INCH_API_URL,
  ONE_INCH_API_VERSION,
  ONE_INCH_API_KEY,
  ONE_INCH_API_AUTH_HEADER,
  ONE_INCH_SWAP_CHAIN_IDS,
  ONE_INCH_ALLOWED_SWAP_PROTOCOLS = '',
  ONE_INCH_EXCLUDED_SWAP_PROTOCOLS = '',
  ONE_INCH_API_SPOT_URL,
  ONE_INCH_API_SPOT_VERSION,
  ONE_INCH_API_SPOT_KEY,
  ONE_INCH_API_SPOT_AUTH_HEADER,
  SDK_RPC_GATEWAY,
  SDK_SUBGRAPH_CONFIG,
  SDK_DISTRIBUTIONS_BASE_URL,
  SDK_DISTRIBUTIONS_FILES,
  SDK_USE_FORK = '',
  SDK_FORK_CONFIG = '',
  SUMMER_HUB_CHAIN_ID,
  SUMMER_DEPLOYED_CHAINS_ID,
  SUMMER_DEPLOYMENT_CONFIG,
} = process.env

export function addSdkConfig({ stack }: StackContext, api: Api) {
  if (
    !COINGECKO_API_URL ||
    !COINGECKO_API_VERSION ||
    !COINGECKO_API_KEY ||
    !COINGECKO_API_AUTH_HEADER ||
    !COINGECKO_SUPPORTED_CHAIN_IDS ||
    !ONE_INCH_API_URL ||
    !ONE_INCH_API_VERSION ||
    !ONE_INCH_API_KEY ||
    !ONE_INCH_API_AUTH_HEADER ||
    !ONE_INCH_SWAP_CHAIN_IDS ||
    !ONE_INCH_API_SPOT_URL ||
    !ONE_INCH_API_SPOT_VERSION ||
    !ONE_INCH_API_SPOT_KEY ||
    !ONE_INCH_API_SPOT_AUTH_HEADER ||
    !SDK_RPC_GATEWAY ||
    !SDK_SUBGRAPH_CONFIG ||
    !SDK_DISTRIBUTIONS_BASE_URL ||
    !SDK_DISTRIBUTIONS_FILES ||
    !SUMMER_HUB_CHAIN_ID ||
    !SUMMER_DEPLOYED_CHAINS_ID ||
    !SUMMER_DEPLOYMENT_CONFIG
  ) {
    throw new Error(
      'Some SDK configuration env variables are missing: ' +
        JSON.stringify(
          Object.entries({
            COINGECKO_API_URL,
            COINGECKO_API_VERSION,
            COINGECKO_API_KEY,
            COINGECKO_API_AUTH_HEADER,
            COINGECKO_SUPPORTED_CHAIN_IDS,
            ONE_INCH_API_URL,
            ONE_INCH_API_VERSION,
            ONE_INCH_API_KEY,
            ONE_INCH_API_AUTH_HEADER,
            ONE_INCH_SWAP_CHAIN_IDS,
            ONE_INCH_API_SPOT_URL,
            ONE_INCH_API_SPOT_VERSION,
            ONE_INCH_API_SPOT_KEY,
            ONE_INCH_API_SPOT_AUTH_HEADER,
            SDK_RPC_GATEWAY,
            SDK_SUBGRAPH_CONFIG,
            SDK_DISTRIBUTIONS_BASE_URL,
            SDK_DISTRIBUTIONS_FILES,
            SUMMER_HUB_CHAIN_ID,
            SUMMER_DEPLOYED_CHAINS_ID,
            SUMMER_DEPLOYMENT_CONFIG,
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
      COINGECKO_API_URL,
      COINGECKO_API_VERSION,
      COINGECKO_API_KEY,
      COINGECKO_API_AUTH_HEADER,
      COINGECKO_SUPPORTED_CHAIN_IDS,
      ONE_INCH_API_URL,
      ONE_INCH_API_VERSION,
      ONE_INCH_API_KEY,
      ONE_INCH_API_AUTH_HEADER,
      ONE_INCH_SWAP_CHAIN_IDS,
      ONE_INCH_ALLOWED_SWAP_PROTOCOLS,
      ONE_INCH_EXCLUDED_SWAP_PROTOCOLS,
      ONE_INCH_API_SPOT_URL,
      ONE_INCH_API_SPOT_VERSION,
      ONE_INCH_API_SPOT_KEY,
      ONE_INCH_API_SPOT_AUTH_HEADER,
      SDK_RPC_GATEWAY,
      SDK_SUBGRAPH_CONFIG,
      SDK_DISTRIBUTIONS_BASE_URL,
      SDK_DISTRIBUTIONS_FILES,
      SDK_USE_FORK,
      SDK_FORK_CONFIG,
      SUMMER_HUB_CHAIN_ID,
      SUMMER_DEPLOYED_CHAINS_ID,
      SUMMER_DEPLOYMENT_CONFIG,
    },
  })

  api.addRoutes(stack, {
    'ANY /api/sdk/{proxy+}': sdkRouterFunction,
  })
}
