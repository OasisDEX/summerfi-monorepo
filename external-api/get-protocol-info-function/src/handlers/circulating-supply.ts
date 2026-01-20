import { Address, createPublicClient, getAddress, http, parseAbiItem } from 'viem'
import { base } from 'viem/chains'
import { Logger } from '@aws-lambda-powertools/logger'
import { ChainId } from '@summerfi/serverless-shared'
import { getRpcUrl } from '../utils/rpc'

const logger = new Logger({ serviceName: 'get-protocol-info-function' })

// Base network addresses
const SUMMER_TOKEN_ADDRESS = '0x194f360D130F2393a5E9F3117A6a1B78aBEa1624' as Address
const VESTING_WALLET_FACTORY_ADDRESS = '0x5f3cd3a45E6B8c2B29DDC80411C58291740E8886' as Address
const VESTING_WALLET_FACTORY_V2_ADDRESS = '0x3aA85a023C0e935CDb5d1CBB2d7BC5EAC5c69BeB' as Address

// Minimal ABIs - only what we need
const erc20Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

const vestingWalletAbi = [
  {
    type: 'function',
    name: 'releasable',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

interface CirculatingSupplyResponseBody {
  circulatingSupply: bigint
  additionalAddressesNonCirculating: bigint
}

/**
 * Handler for circulating supply route
 * Calculates circulating supply by:
 * 1. Getting all vesting wallets from factories
 * 2. For each vesting wallet, calculating non-circulating = balance - releasable
 * 3. Subtracting non-circulating from total supply (1 billion)
 * 4. Also checking additional addresses (empty array for now)
 */
export async function handleCirculatingSupplyRoute(): Promise<CirculatingSupplyResponseBody> {
  logger.info('Handling circulating supply route')

  const publicClient = createPublicClient({
    chain: base,
    transport: http(getRpcUrl(ChainId.BASE)),
  })

  const TOTAL_SUPPLY = 1000000000n * 10n ** 18n // 1 billion tokens with 18 decimals

  // Get all vesting wallets from both factories by querying events
  // Query from block 0 to latest (or a reasonable range)
  logger.info('Querying VestingWalletCreated events from factories')

  const [v1Events, v2Events] = await Promise.all([
    publicClient.getLogs({
      address: VESTING_WALLET_FACTORY_ADDRESS,
      event: parseAbiItem(
        'event VestingWalletCreated(address indexed beneficiary, address indexed vestingWallet, uint256 timeBasedAmount, uint256[] goalAmounts, uint8 vestingType)',
      ),
      fromBlock: 0n,
    }),
    publicClient.getLogs({
      address: VESTING_WALLET_FACTORY_V2_ADDRESS,
      event: parseAbiItem(
        'event VestingWalletCreated(address indexed beneficiary, address indexed vestingWallet, uint256 timeBasedAmount, uint256[] goalAmounts, uint8 vestingType)',
      ),
      fromBlock: 0n,
    }),
  ])

  logger.info(
    `Found ${v1Events.length} V1 vesting wallets and ${v2Events.length} V2 vesting wallets`,
  )

  // Extract unique vesting wallet addresses
  const vestingWallets = new Set<Address>()
  v1Events.forEach((event) => {
    if (event.args.vestingWallet) {
      vestingWallets.add(getAddress(event.args.vestingWallet))
    }
  })
  v2Events.forEach((event) => {
    if (event.args.vestingWallet) {
      vestingWallets.add(getAddress(event.args.vestingWallet))
    }
  })

  logger.info(`Total unique vesting wallets: ${vestingWallets.size}`)

  // For each vesting wallet, get balance and releasable amount
  const vestingWalletArray = Array.from(vestingWallets)
  const calls = vestingWalletArray.flatMap((wallet) => [
    {
      address: SUMMER_TOKEN_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [wallet],
    } as const,
    {
      address: wallet,
      abi: vestingWalletAbi,
      functionName: 'releasable',
      args: [SUMMER_TOKEN_ADDRESS],
    } as const,
  ])

  logger.info(`Making ${calls.length} contract calls to get balances and releasable amounts`)

  const results = await publicClient.multicall({
    contracts: calls,
    allowFailure: true,
  })

  // Calculate non-circulating from vesting wallets
  let nonCirculatingFromVesting = 0n
  const stride = 2

  for (let i = 0; i < vestingWalletArray.length; i++) {
    const balanceResult = results[i * stride]
    const releasableResult = results[i * stride + 1]

    if (balanceResult.status === 'success' && releasableResult.status === 'success') {
      const balance = balanceResult.result as bigint
      const releasable = releasableResult.result as bigint
      const nonCirculating = balance > releasable ? balance - releasable : 0n

      nonCirculatingFromVesting += nonCirculating

      logger.debug(
        `Vesting wallet ${vestingWalletArray[i]}: balance=${balance}, releasable=${releasable}, nonCirculating=${nonCirculating}`,
      )
    } else {
      logger.warn(`Failed to get data for vesting wallet ${vestingWalletArray[i]}`, {
        balanceError: balanceResult.status === 'failure' ? balanceResult.error : null,
        releasableError: releasableResult.status === 'failure' ? releasableResult.error : null,
      })
    }
  }

  logger.info(`Total non-circulating from vesting wallets: ${nonCirculatingFromVesting}`)

  // Additional addresses to check (empty for now)
  const additionalAddresses: Address[] = []
  let additionalAddressesNonCirculating = 0n

  if (additionalAddresses.length > 0) {
    logger.info(`Checking ${additionalAddresses.length} additional addresses`)
    const additionalCalls = additionalAddresses.map((address) => ({
      address: SUMMER_TOKEN_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    }))

    const additionalResults = await publicClient.multicall({
      contracts: additionalCalls,
      allowFailure: true,
    })

    additionalAddressesNonCirculating = additionalResults.reduce((sum, result) => {
      if (result.status === 'success') {
        return sum + (result.result as bigint)
      }
      return sum
    }, 0n)

    logger.info(
      `Total non-circulating from additional addresses: ${additionalAddressesNonCirculating}`,
    )
  }

  // Calculate circulating supply
  const totalNonCirculating = nonCirculatingFromVesting + additionalAddressesNonCirculating
  const circulatingSupply =
    TOTAL_SUPPLY > totalNonCirculating ? TOTAL_SUPPLY - totalNonCirculating : 0n

  logger.info(`Circulating supply calculation:`, {
    totalSupply: TOTAL_SUPPLY.toString(),
    nonCirculatingFromVesting: nonCirculatingFromVesting.toString(),
    additionalAddressesNonCirculating: additionalAddressesNonCirculating.toString(),
    totalNonCirculating: totalNonCirculating.toString(),
    circulatingSupply: circulatingSupply.toString(),
  })

  return {
    circulatingSupply,
    additionalAddressesNonCirculating,
  }
}
;``
