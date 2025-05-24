import { z } from 'zod/v4'

// validate required envs are defined using zod library
const envSchema = z.object({
  SDK_DEPLOYED_VERSIONS_MAP: z.string().nonempty(),
  SDK_LOGGING_ENABLED: z.string().nonempty().default('false'),
  SDK_DEBUG_ENABLED: z.string().nonempty().default('false'),
  POWERTOOLS_LOG_LEVEL: z.string().nonempty().default('INFO'),
  COINGECKO_API_URL: z.string().nonempty(),
  COINGECKO_API_VERSION: z.string().nonempty(),
  COINGECKO_API_KEY: z.string().nonempty(),
  COINGECKO_API_AUTH_HEADER: z.string().nonempty(),
  COINGECKO_SUPPORTED_CHAIN_IDS: z.string().nonempty(),
  ONE_INCH_API_URL: z.string().nonempty(),
  ONE_INCH_API_VERSION: z.string().nonempty(),
  ONE_INCH_API_KEY: z.string().nonempty(),
  ONE_INCH_API_AUTH_HEADER: z.string().nonempty(),
  ONE_INCH_SWAP_CHAIN_IDS: z.string().nonempty(),
  ONE_INCH_ALLOWED_SWAP_PROTOCOLS: z.string().nonempty().default(''),
  ONE_INCH_EXCLUDED_SWAP_PROTOCOLS: z.string().nonempty().default(''),
  ONE_INCH_API_SPOT_URL: z.string().nonempty(),
  ONE_INCH_API_SPOT_VERSION: z.string().nonempty(),
  ONE_INCH_API_SPOT_KEY: z.string().nonempty(),
  ONE_INCH_API_SPOT_AUTH_HEADER: z.string().nonempty(),
  SDK_RPC_GATEWAY: z.string().nonempty(),
  FUNCTIONS_API_URL: z.string().nonempty(),
  SDK_SUBGRAPH_CONFIG: z.string().nonempty(),
  SDK_DISTRIBUTIONS_BASE_URL: z.string().nonempty(),
  SDK_DISTRIBUTIONS_FILES: z.string().nonempty(),
  SDK_NAMED_REFERRALS_FILE: z.string().nonempty(),
  SDK_USE_FORK: z.string().nonempty().default(''),
  SDK_FORK_CONFIG: z.string().nonempty().default(''),
  SUMMER_HUB_CHAIN_ID: z.string().nonempty(),
  SUMMER_DEPLOYED_CHAINS_ID: z.string().nonempty(),
  SUMMER_DEPLOYMENT_CONFIG: z.string().nonempty(),
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
  .nonempty()
  .transform((str) => {
    try {
      return JSON.parse(str)
    } catch (error) {
      console.error('Error parsing SDK_DEPLOYED_VERSIONS_MAP:', str, error)
    }
  })
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
