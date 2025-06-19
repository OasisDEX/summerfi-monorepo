import { z } from 'zod/v4'

import { config } from '@dotenvx/dotenvx'
import { zCustom } from './z-custom'

config({ path: ['../.env', '.env'], override: true, debug: false, ignore: ['MISSING_ENV_FILE'] })

// validate required envs are defined using zod library
const envSchema = z.object({
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
  ONE_INCH_ALLOWED_SWAP_PROTOCOLS: z.string().default(''),
  ONE_INCH_EXCLUDED_SWAP_PROTOCOLS: z.string().default(''),
  ONE_INCH_API_SPOT_URL: z.string().nonempty(),
  ONE_INCH_API_SPOT_VERSION: z.string().nonempty(),
  ONE_INCH_API_SPOT_KEY: z.string().nonempty(),
  ONE_INCH_API_SPOT_AUTH_HEADER: z.string().nonempty(),
  SUMMER_HUB_CHAIN_ID: z.string().nonempty(),
  SUMMER_DEPLOYED_CHAINS_ID: z.string().nonempty(),
  SUMMER_DEPLOYMENT_CONFIG: z.string().nonempty(),
  FUNCTIONS_API_URL: z.string().nonempty(),
  SDK_RPC_GATEWAY: z.string().nonempty(),
  SDK_SUBGRAPH_CONFIG: zCustom.jsonString(),
  SDK_LOGGING_ENABLED: z.string().default('false'),
  SDK_DEBUG_ENABLED: z.string().default('false'),
  SDK_DISTRIBUTIONS_BASE_URL: z.string().nonempty(),
  SDK_DISTRIBUTIONS_FILES: z.string().nonempty(),
  SDK_NAMED_REFERRALS_FILE: z.string().nonempty(),
  SDK_USE_FORK: z.string().nonempty().default(''),
  SDK_FORK_CONFIG: z.string().default(''),
  SDK_DEPLOYED_VERSIONS_MAP: zCustom.jsonString(),
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
    } catch (error: { message: string } | any) {
      throw new Error(`Invalid SDK_DEPLOYED_VERSIONS_MAP: ${error.message}`)
    }
  })
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
