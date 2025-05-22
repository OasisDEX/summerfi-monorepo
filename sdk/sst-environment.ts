import { config } from 'dotenv'
import { z } from 'zod/v4'

config({ path: '.env', debug: false, override: true })

// validate required envs are defined using zod library
const envSchema = z.object({
  SDK_DEPLOYED_VERSIONS_MAP: z.string(),
  SDK_LOGGING_ENABLED: z.string().default('false'),
  SDK_DEBUG_ENABLED: z.string().default('false'),
  POWERTOOLS_LOG_LEVEL: z.string().default('INFO'),
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
  SDK_USE_FORK: z.string().default(''),
  SDK_FORK_CONFIG: z.string().default(''),
  SUMMER_HUB_CHAIN_ID: z.string(),
  SUMMER_DEPLOYED_CHAINS_ID: z.string(),
  SUMMER_DEPLOYMENT_CONFIG: z.string(),
})

// parse envs
const parsedEnv = envSchema.safeParse(process.env)
if (!parsedEnv.success) {
  console.error('Invalid environment variables:', z.prettifyError(parsedEnv.error))
  process.exit(1)
}

export const environmentVariables = parsedEnv.data

export const sdkDeployedVersionsMap = z
  .string()
  .transform((str) => JSON.parse(str))
  .pipe(z.json())
  .pipe(
    z.record(
      z.string().regex(/^v\d$/),
      z.string().regex(/^\d+\.\d+\.\d+$/, {
        error: 'SDK_DEPLOYED_VERSIONS_MAP values must be in the format "X.X.X"',
      }),
      {
        error: 'SDK_DEPLOYED_VERSIONS_MAP keys must be in the format "vX"',
      },
    ),
  )
  .parse(parsedEnv.data.SDK_DEPLOYED_VERSIONS_MAP)
