import { z } from 'zod'
import { config } from 'dotenv'

config({ path: '../.env', debug: true, override: true })

// validate required envs are defined using zod library
const envSchema = z.object({
  SDK_VERSION: z.string(),
  SDK_LOGGING_ENABLED: z.string().optional().default('false'),
  SDK_DEBUG_ENABLED: z.string().optional().default('false'),
  POWERTOOLS_LOG_LEVEL: z.string().optional().default('INFO'),
  COINGECKO_API_URL: z.string(),
  COINGECKO_API_VERSION: z.string(),
  COINGECKO_API_KEY: z.string(),
  COINGECKO_API_AUTH_HEADER: z.string(),
  COINGECKO_SUPPORTED_CHAIN_IDS: z.string(),
  ONE_INCH_API_URL: z.string(),
  ONE_INCH_API_VERSION: z.string(),
  ONE_INCH_API_KEY: z.string(),
  ONE_INCH_API_AUTH_HEADER: z.string(),
  ONE_INCH_SWAP_CHAIN_IDS: z.string(),
  ONE_INCH_ALLOWED_SWAP_PROTOCOLS: z.string().optional(),
  ONE_INCH_EXCLUDED_SWAP_PROTOCOLS: z.string().optional(),
  ONE_INCH_API_SPOT_URL: z.string(),
  ONE_INCH_API_SPOT_VERSION: z.string(),
  ONE_INCH_API_SPOT_KEY: z.string(),
  ONE_INCH_API_SPOT_AUTH_HEADER: z.string(),
  SDK_RPC_GATEWAY: z.string(),
  FUNCTIONS_API_URL: z.string(),
  SDK_SUBGRAPH_CONFIG: z.string(),
  SDK_DISTRIBUTIONS_BASE_URL: z.string(),
  SDK_DISTRIBUTIONS_FILES: z.string(),
  SDK_NAMED_REFERRALS_FILE: z.string(),
  SDK_USE_FORK: z.string().optional(),
  SDK_FORK_CONFIG: z.string().optional(),
  SUMMER_HUB_CHAIN_ID: z.string(),
  SUMMER_DEPLOYED_CHAINS_ID: z.string(),
  SUMMER_DEPLOYMENT_CONFIG: z.string(),
})

// parse envs
const parsedEnv = envSchema.safeParse(process.env)
if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format())
  throw new Error('Invalid environment variables')
}

export const environmentVariables = parsedEnv.data
