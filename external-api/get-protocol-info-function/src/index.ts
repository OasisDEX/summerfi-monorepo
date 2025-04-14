import { z } from 'zod'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import { chainIdSchema } from '@summerfi/serverless-shared/validators'
import { Logger } from '@aws-lambda-powertools/logger'
import { Address, ChainId, isValidAddress } from '@summerfi/serverless-shared'
import {
  getUsers,
  getUsersPositions,
  UserPositionsQuery,
} from '@summerfi/summer-earn-protocol-subgraph'
import { getVaults } from '@summerfi/summer-earn-protocol-subgraph'
import { createPublicClient, http } from 'viem'
import { mainnet, optimism, arbitrum, base, sonic } from 'viem/chains'
import { supportedChains } from '@summerfi/summer-earn-protocol-subgraph'
import { fleetRewardsManagerAbi } from './abis/fleetRewardsManager'

const rewardTokenPerChain: Partial<Record<ChainId, Address>> = {
  [ChainId.MAINNET]: '0x194f360D130F2393a5E9F3117A6a1B78aBEa1624',
  [ChainId.ARBITRUM]: '0x194f360D130F2393a5E9F3117A6a1B78aBEa1624',
  [ChainId.BASE]: '0x194f360D130F2393a5E9F3117A6a1B78aBEa1624',
  [ChainId.SONIC]: '0x4e0037f487bBb588bf1B7a83BDe6c34FeD6099e3',
}

const logger = new Logger({ serviceName: 'get-protocol-info-function' })

const addressesSchema = z
  .string()
  .transform((val) => val.split(','))
  .refine(
    (val) => {
      return val.every((address) => isValidAddress(address))
    },
    { message: 'Invalid format of addresses' },
  )
  .transform((val) => val.map((address) => address as Address))

const baseParamsSchema = z
  .object({
    chainId: chainIdSchema.optional(),
  })
  .optional()
  .transform((val) => val ?? {})

const userParamsSchema = z.union([
  // GET query params schema
  z.object({
    addresses: addressesSchema.refine((addresses) => addresses.length <= 1000, {
      message: 'Maximum of 1000 addresses allowed',
    }),
    chainId: chainIdSchema.optional(),
  }),
  // POST body schema
  z.object({
    addresses: z
      .array(z.string())
      .refine((addresses) => addresses.every((address) => isValidAddress(address)), {
        message: 'Invalid format of addresses',
      })
      .refine((addresses) => addresses.length <= 1000, {
        message: 'Maximum of 1000 addresses allowed',
      })
      .transform((addresses) => addresses.map((address) => address as Address)),
    chainId: chainIdSchema.optional(),
  }),
])

interface UserRewardsInfo {
  unclaimed: number
  claimed: number
  total: number
}

interface UserPositionsInfo {
  address: Address
  totalValueLockedUSD: number
  rewards: UserRewardsInfo
}

interface ProtocolInfo {
  totalValueLockedUSD: number
  totalVaults: number
}

interface UsersResponseBody {
  users: UserPositionsInfo[]
}

interface ProtocolResponseBody {
  protocol: ProtocolInfo
}

interface UserChainRewards {
  address: Address
  chainId: ChainId
  rewardsManagerAddresses: Address[]
}

interface AllUsersResponseBody {
  addresses: Address[]
}

const getChainConfig = (chainId: ChainId) => {
  logger.info(`Getting chain configuration for chain ID: ${chainId}`)
  switch (chainId) {
    case ChainId.MAINNET:
      return mainnet
    case ChainId.OPTIMISM:
      return optimism
    case ChainId.ARBITRUM:
      return arbitrum
    case ChainId.BASE:
      return base
    case ChainId.SONIC:
      return sonic
    default:
      logger.error(`Unsupported chain ID: ${chainId}`)
      throw new Error(`Unsupported chain ID: ${chainId}`)
  }
}

function getRpcUrl(chainId: ChainId): string {
  const baseUrl = process.env.RPC_GATEWAY
  if (!baseUrl) {
    logger.error('RPC_GATEWAY is not set')
    throw new Error('RPC_GATEWAY is not set')
  }

  const networkName = {
    [ChainId.MAINNET]: 'mainnet',
    [ChainId.OPTIMISM]: 'optimism',
    [ChainId.ARBITRUM]: 'arbitrum',
    [ChainId.BASE]: 'base',
    [ChainId.SEPOLIA]: 'sepolia',
    [ChainId.SONIC]: 'sonic',
  }[chainId]

  if (!networkName) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }

  return `${baseUrl}?network=${networkName}`
}

async function fetchRewards(
  userChainRewards: UserChainRewards[],
  allPositions: {
    chainId: number
    positions: UserPositionsQuery
  }[],
): Promise<Map<Address, UserRewardsInfo>> {
  const rewardsByUser = new Map<Address, UserRewardsInfo>()
  logger.info(`Fetching rewards for ${userChainRewards.length} users`)

  await Promise.all(
    userChainRewards.map(async ({ address, chainId, rewardsManagerAddresses }) => {
      logger.info(`Fetching rewards for address: ${address} on chain ID: ${chainId}`)
      if (rewardsManagerAddresses.length === 0) {
        logger.warn(`No rewards manager addresses found for address: ${address}`)
        return
      }

      try {
        // Fetch current (unclaimed) rewards
        const client = createPublicClient({
          chain: getChainConfig(chainId),
          transport: http(getRpcUrl(chainId)),
        })
        logger.info(
          `xxx Rewards manager addresses: ${JSON.stringify(rewardsManagerAddresses)} on chain ${chainId} for user ${address} for token ${rewardTokenPerChain[chainId]}`,
        )
        const rewardsResult = await client.multicall({
          contracts: rewardsManagerAddresses.map((managerAddress) => ({
            abi: fleetRewardsManagerAbi,
            address: managerAddress,
            functionName: 'earned',
            args: [address, rewardTokenPerChain[chainId]],
          })),
        })
        // logger.info(`xxx Rewards result: ${JSON.stringify(rewardsResult)}`)
        const currentRewards = rewardsResult
          .map((result) => result.result)
          .filter((result): result is bigint => typeof result === 'bigint')
          .reduce((acc, reward) => acc + Number(reward), 0)
        const normalizedCurrentRewards = currentRewards / 10 ** 18

        // Get claimed rewards from already fetched positions
        const chainPositions =
          allPositions.find((p) => p.chainId === chainId)?.positions.positions ?? []
        const claimedRewards = chainPositions
          .filter((position) => position.account.id.toLowerCase() === address.toLowerCase())
          .reduce((sum, position) => sum + Number(position.account.claimedSummerTokenNormalized), 0)

        logger.info(`Rewards for address ${address} on chain ${chainId}:`, {
          unclaimed: normalizedCurrentRewards,
          claimed: claimedRewards,
        })

        // Combine with existing rewards for this user
        const existingRewards = rewardsByUser.get(address) ?? { unclaimed: 0, claimed: 0, total: 0 }
        rewardsByUser.set(address, {
          unclaimed: existingRewards.unclaimed + normalizedCurrentRewards,
          claimed: existingRewards.claimed + claimedRewards,
          total:
            existingRewards.unclaimed +
            normalizedCurrentRewards +
            existingRewards.claimed +
            claimedRewards,
        })
      } catch (error) {
        logger.error(
          `Error fetching rewards for address ${address} on chain ${chainId}:`,
          error instanceof Error ? error : String(error),
        )
        throw error
      }
    }),
  )

  logger.info(`Rewards fetching completed. Total users processed: ${userChainRewards.length}`)
  return rewardsByUser
}

async function handleUsersRoute(
  params: z.infer<typeof userParamsSchema>,
  subgraphBase: string,
): Promise<UsersResponseBody> {
  logger.info(`Handling users route with parameters: ${JSON.stringify(params)}`)
  const chainsToQuery = params.chainId ? [params.chainId] : supportedChains
  logger.info(`Chains to query: ${chainsToQuery.join(', ')}`)

  const usersAddresses = [
    ...new Set(params.addresses.map((address) => address.toLowerCase())),
  ] as Address[]

  // First, fetch all positions across chains
  const allPositions = await Promise.all(
    chainsToQuery.map(async (chainId) => {
      logger.info(`Fetching positions for chain ID: ${chainId}`)
      try {
        const positions = await getUsersPositions(
          { userAddresses: usersAddresses },
          { chainId, urlBase: subgraphBase },
        )
        logger.info(`Fetched positions for chain ID: ${chainId}`)
        return { chainId, positions }
      } catch (error) {
        logger.warn('Failed to fetch positions for chain', { chainId, error })
        return { chainId, positions: { positions: [] } }
      }
    }),
  )

  // Prepare rewards fetching data structure
  const userChainRewards: UserChainRewards[] = []
  const positionsByAddress = new Map<
    Address,
    { totalValueLockedUSD: number; rewards: UserRewardsInfo }
  >()

  // Initialize positions map and collect rewards manager addresses
  for (const address of usersAddresses) {
    logger.info(`Initializing position for address: ${address}`)
    positionsByAddress.set(address, {
      totalValueLockedUSD: 0,
      rewards: { unclaimed: 0, claimed: 0, total: 0 },
    })
  }

  // Process positions and collect rewards manager addresses per user per chain
  for (const { chainId, positions } of allPositions) {
    for (const address of usersAddresses) {
      const userPositions = positions.positions.filter(
        (position) => position.account.id.toLowerCase() === address.toLowerCase(),
      )

      // Sum up TVL for this user's positions
      const addressData = positionsByAddress.get(address)
      if (addressData) {
        addressData.totalValueLockedUSD += userPositions.reduce(
          (sum, position) => sum + Number(position.inputTokenBalanceNormalizedInUSD),
          0,
        )
        logger.info(`Updated TVL for address ${address}: ${addressData.totalValueLockedUSD}`)
      }

      // Collect unique rewards manager addresses for this user on this chain
      const rewardsManagerAddresses = Array.from(
        new Set(userPositions.map((position) => position.vault.rewardsManager.id as Address)),
      )

      if (rewardsManagerAddresses.length > 0) {
        userChainRewards.push({
          address,
          chainId,
          rewardsManagerAddresses,
        })
        logger.info(
          `Collected rewards manager addresses for address ${address} on chain ID ${chainId}`,
        )
      }
    }
  }

  // Fetch rewards in parallel for all users across all chains
  const rewardsByUser = await fetchRewards(userChainRewards, allPositions)
  logger.info(`Rewards by user: ${JSON.stringify(rewardsByUser)}`)
  // Combine positions and rewards data
  const users = Array.from(positionsByAddress.entries()).map(([address, data]) => {
    const rewardsInfo = rewardsByUser.get(address) ?? { unclaimed: 0, claimed: 0, total: 0 }
    logger.info(`Rewards info for address ${address}: ${JSON.stringify(rewardsInfo)}`)
    return {
      address,
      totalValueLockedUSD: data.totalValueLockedUSD,
      rewards: {
        unclaimed: rewardsInfo.unclaimed,
        claimed: rewardsInfo.claimed,
        total: rewardsInfo.total,
      },
    }
  })

  logger.info(`Returning positions data for ${users.length} users`)
  return {
    users,
  }
}

async function handleProtocolRoute(
  params: z.infer<typeof baseParamsSchema>,
  subgraphBase: string,
): Promise<ProtocolResponseBody> {
  logger.info(`Handling protocol route with parameters: ${JSON.stringify(params)}`)
  const chainsToQuery = params.chainId ? [params.chainId] : supportedChains

  const allVaults = await Promise.all(
    chainsToQuery.map(async (chainId) => {
      logger.info(`Fetching vaults for chain ID: ${chainId}`)
      try {
        const vaults = await getVaults({
          chainId,
          urlBase: subgraphBase,
        })
        logger.info(`Fetched vaults for chain ID: ${chainId}`)
        return vaults
      } catch (error) {
        logger.warn('Failed to fetch vaults for chain', { chainId, error })
        return { vaults: [] }
      }
    }),
  )

  // Aggregate data across all chains
  const aggregatedData = allVaults.reduce(
    (acc, chainVaults) => {
      const chainTVL = chainVaults.vaults.reduce(
        (sum, vault) => sum + Number(vault.totalValueLockedUSD),
        0,
      )
      logger.info(`Total TVL for chain vaults: ${chainTVL}`)

      return {
        totalValueLockedUSD: acc.totalValueLockedUSD + chainTVL,
        totalVaults: acc.totalVaults + chainVaults.vaults.length,
      }
    },
    { totalValueLockedUSD: 0, totalVaults: 0 },
  )

  logger.info(`Returning aggregated protocol data: ${JSON.stringify(aggregatedData)}`)
  return {
    protocol: aggregatedData,
  }
}

async function handleAllUsersRoute(subgraphBase: string): Promise<AllUsersResponseBody> {
  const PAGE_SIZE = 5000
  logger.info('Fetching all users across all chains')

  try {
    const allUsers: Address[] = []

    await Promise.all(
      supportedChains.map(async (chainId) => {
        let hasMore = true
        let currentPage = 0

        while (hasMore) {
          const skip = currentPage * PAGE_SIZE
          logger.info(`Fetching users for chain ${chainId}, page ${currentPage}, skip ${skip}`)

          const result = await getUsers(
            {
              first: PAGE_SIZE,
              skip: skip,
            },
            {
              chainId,
              urlBase: subgraphBase,
            },
          )

          allUsers.push(...result.accounts.map((account) => account.id as Address))

          // If we got less results than PAGE_SIZE, we've reached the end
          hasMore = result.accounts.length === PAGE_SIZE
          currentPage++
        }
      }),
    )

    const addresses = [...new Set(allUsers)]
    logger.info(`Found ${addresses.length} unique addresses across all chains`)

    return {
      addresses,
    }
  } catch (error) {
    logger.error(
      'Failed to fetch users:',
      error instanceof Error ? error : new Error(String(error)),
    )
    throw error
  }
}

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE

  logger.addContext(context)

  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return ResponseInternalServerError('SUBGRAPH_BASE is not set')
  }

  const isUsersRoute = event.rawPath.endsWith('/users')
  const isAllUsersRoute = event.rawPath.endsWith('/all-users')

  try {
    switch (true) {
      case isAllUsersRoute: {
        const response = await handleAllUsersRoute(SUBGRAPH_BASE)
        return ResponseOk({ body: response })
      }
      case isUsersRoute: {
        let parseResult
        const method = event.requestContext.http.method

        if (method === 'POST') {
          const body = event.body ? JSON.parse(event.body) : {}
          parseResult = userParamsSchema.safeParse(body)
        } else if (method === 'GET') {
          // Log deprecation warning
          logger.warn('GET method is deprecated for /users route. Please use POST instead.')
          parseResult = userParamsSchema.safeParse(event.queryStringParameters)
        } else {
          return ResponseBadRequest({ message: 'Method not allowed. Use POST or GET.' })
        }

        if (!parseResult.success) {
          logger.warn('Validation errors occurred', { errors: parseResult.error.errors })
          return ResponseBadRequest({
            message: 'Validation Errors',
            errors: parseResult.error.errors,
          })
        }

        const response = await handleUsersRoute(parseResult.data, SUBGRAPH_BASE)
        return ResponseOk({ body: response })
      }
      default: {
        logger.info('Handling protocol route')
        const parseResult = baseParamsSchema.safeParse(event.queryStringParameters)
        logger.info('Protocol route parsed', parseResult)
        if (!parseResult.success) {
          logger.warn('Validation errors occurred', { errors: parseResult.error.errors })
          return ResponseBadRequest({
            message: 'Validation Errors',
            errors: parseResult.error.errors,
          })
        }
        const response = await handleProtocolRoute(parseResult.data, SUBGRAPH_BASE)
        return ResponseOk({ body: response })
      }
    }
  } catch (error) {
    logger.error('Error processing request:', error instanceof Error ? error : String(error))
    return ResponseInternalServerError('Failed to process request - please contact support')
  }
}

export default handler
