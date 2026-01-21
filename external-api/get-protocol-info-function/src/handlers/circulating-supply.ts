import { Address, createPublicClient, formatUnits, getAddress, http, parseAbiItem } from 'viem'
import { base } from 'viem/chains'
import { ChainId } from '@summerfi/serverless-shared'
import { getRpcUrl } from '../utils/rpc'
import { getChainConfig, logger, SUMMER_TOKEN_ADDRESSES } from '..'
import { supportedChains } from '@summerfi/summer-earn-protocol-subgraph'

// Vesting wallet factories (only on Base)
const VESTING_WALLET_FACTORY_ADDRESS = '0x5f3cd3a45E6B8c2B29DDC80411C58291740E8886' as Address
const VESTING_WALLET_FACTORY_V2_ADDRESS = '0x3aA85a023C0e935CDb5d1CBB2d7BC5EAC5c69BeB' as Address

// Timelock addresses (chain-specific)
const TIMELOCK_ADDRESSES: Partial<Record<ChainId, Address>> = {
  [ChainId.MAINNET]: '0x447BF9d1485ABDc4C1778025DfdfbE8b894C3796',
  [ChainId.ARBITRUM]: '0x447BF9d1485ABDc4C1778025DfdfbE8b894C3796',
  [ChainId.BASE]: '0x447BF9d1485ABDc4C1778025DfdfbE8b894C3796',
  [ChainId.SONIC]: '0x4c32A28AD95deaBc06bF7C83AdEbCF6fe6721ED9',
  [ChainId.HYPERLIQUID]: '0x244c6EFC140b9cC4D69d3bf4d9137Dc4195Be86c',
}

// Common excluded addresses (same on all chains)
const COMMON_EXCLUDED_ADDRESSES: Address[] = [
  '0xE470684D279386Ce126d0576086C123a930312B3', // Foundation Treasury
  '0xB0F53Fc4e15301147de9b3e49C3DB942E3F118F2', // Foundation Opex
  '0xDE1Bf64033Fa4BabB5d047C18E858c0f272B2f32', // Summer Treasury
  '0x370CF698CF1433532F39D231175F83dC71D03122', // Rays s2 holder
  '0x54a2ea2B8f57D62c149ace01d7Ac1fd9A880B8dd', // Rays s1 holder,
  '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // merkl
]

// Supported chains for circulating supply calculation
const SUPPORTED_CHAINS = supportedChains as ChainId[]

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
  circulatingSupply: string
}

/**
 * Handler for circulating supply route
 * Calculates circulating supply by:
 * 1. Getting all vesting wallets from factories (Base only)
 * 2. For each vesting wallet, calculating non-circulating = balance - releasable
 * 3. Checking excluded addresses on all supported chains
 * 4. Subtracting non-circulating from total supply (1 billion)
 */
export async function handleCirculatingSupplyRoute(): Promise<CirculatingSupplyResponseBody> {
  logger.info('Handling circulating supply route')

  const TOTAL_SUPPLY = 1000000000n * 10n ** 18n // 1 billion tokens with 18 decimals

  let totalNonCirculating = 0n

  // Step 1: Get vesting wallets from Base (only chain with vesting factories)
  logger.info('Querying vesting wallets from Base network')
  const basePublicClient = createPublicClient({
    chain: base,
    transport: http(getRpcUrl(ChainId.BASE)),
  })

  const baseTokenAddress = SUMMER_TOKEN_ADDRESSES[ChainId.BASE]
  if (!baseTokenAddress) {
    throw new Error('Summer token address not found for Base')
  }

  const [v1Events, v2Events] = await Promise.all([
    basePublicClient.getLogs({
      address: VESTING_WALLET_FACTORY_ADDRESS,
      event: parseAbiItem(
        'event VestingWalletCreated(address indexed beneficiary, address indexed vestingWallet, uint256 timeBasedAmount, uint256[] goalAmounts, uint8 vestingType)',
      ),
      fromBlock: 0n,
    }),
    basePublicClient.getLogs({
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

  // Calculate non-circulating from vesting wallets
  if (vestingWallets.size > 0) {
    const vestingWalletArray = Array.from(vestingWallets)
    const calls = vestingWalletArray.flatMap((wallet) => [
      {
        address: baseTokenAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [wallet],
      } as const,
      {
        address: wallet,
        abi: vestingWalletAbi,
        functionName: 'releasable',
        args: [baseTokenAddress],
      } as const,
    ])

    logger.info(
      `Making ${calls.length} contract calls to get vesting wallet balances and releasable amounts`,
    )

    const results = await basePublicClient.multicall({
      contracts: calls,
      allowFailure: true,
    })

    const stride = 2
    for (let i = 0; i < vestingWalletArray.length; i++) {
      const balanceResult = results[i * stride]
      const releasableResult = results[i * stride + 1]

      if (balanceResult.status === 'success' && releasableResult.status === 'success') {
        const balance = balanceResult.result as bigint
        const releasable = releasableResult.result as bigint
        const nonCirculating = balance > releasable ? balance - releasable : 0n

        totalNonCirculating += nonCirculating

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
  }

  logger.info(`Total non-circulating from vesting wallets: ${totalNonCirculating}`)

  // Step 2: Check excluded addresses on all supported chains
  logger.info('Checking excluded addresses on all supported chains')

  const excludedAddressesNonCirculating = await Promise.all(
    SUPPORTED_CHAINS.map(async (chainId) => {
      const tokenAddress = SUMMER_TOKEN_ADDRESSES[chainId]
      if (!tokenAddress) {
        logger.warn(`Token address not found for chain ${chainId}, skipping`)
        return 0n
      }

      const publicClient = createPublicClient({
        chain: getChainConfig(chainId),
        transport: http(getRpcUrl(chainId)),
        batch: {
          multicall: {
            deployless: true,
          },
        },
      })

      // Get all excluded addresses for this chain
      const excludedAddresses: Address[] = [...COMMON_EXCLUDED_ADDRESSES]
      const timelockAddress = TIMELOCK_ADDRESSES[chainId]
      if (timelockAddress) {
        excludedAddresses.push(timelockAddress)
      }

      logger.info(`Checking ${excludedAddresses.length} excluded addresses on chain ${chainId}`)

      const calls = excludedAddresses.map((address) => ({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      }))
      const results = await publicClient.multicall({
        contracts: calls,
        allowFailure: true,
      })

      const chainNonCirculating = results.reduce((sum, result) => {
        if (result.status === 'success') {
          return sum + (result.result as bigint)
        } else {
          logger.warn(`Failed to get balance for address on chain ${chainId}`, {
            error: result.status === 'failure' ? result.error : null,
          })
          return sum
        }
      }, 0n)

      logger.info(
        `Chain ${chainId} excluded addresses non-circulating: ${chainNonCirculating.toString()}`,
      )

      return chainNonCirculating
    }),
  )

  const totalExcludedNonCirculating = excludedAddressesNonCirculating.reduce(
    (sum, amount) => sum + amount,
    0n,
  )

  logger.info(
    `Total non-circulating from excluded addresses: ${totalExcludedNonCirculating.toString()}`,
  )

  // Calculate final circulating supply
  totalNonCirculating += totalExcludedNonCirculating
  const circulatingSupply =
    TOTAL_SUPPLY > totalNonCirculating ? TOTAL_SUPPLY - totalNonCirculating : 0n

  logger.info(`Circulating supply calculation:`, {
    totalSupply: TOTAL_SUPPLY.toString(),
    nonCirculatingFromVesting: (totalNonCirculating - totalExcludedNonCirculating).toString(),
    excludedAddressesNonCirculating: totalExcludedNonCirculating.toString(),
    totalNonCirculating: totalNonCirculating.toString(),
    circulatingSupply: circulatingSupply.toString(),
  })

  return {
    circulatingSupply: formatUnits(circulatingSupply, 18),
  }
}
