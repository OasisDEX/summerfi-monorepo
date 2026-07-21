import { formatUnits } from 'viem'

import { chainlinkAggregatorAbi } from '@/constants/abis'
import { CHAINLINK_FEEDS } from '@/constants/addresses'
import { getPublicClient } from '@/lib/clients'
import { type FleetPosition } from '@/lib/positions'

export interface UsdPrices {
  eth: number | null
  eur: number | null
}

const DOLLAR_STABLE_SYMBOLS = new Set(['USDC', 'USDT', 'DAI', 'USDC.E', 'USDBC', 'USDS'])
const ETH_SYMBOLS = new Set(['ETH', 'WETH'])
const EUR_SYMBOLS = new Set(['EURC'])

const readFeed = async (feed: `0x${string}`): Promise<number | null> => {
  try {
    const client = getPublicClient(1) // both feeds live on mainnet

    const [roundData, decimals] = await Promise.all([
      client.readContract({
        address: feed,
        abi: chainlinkAggregatorAbi,
        functionName: 'latestRoundData',
      }),
      client.readContract({ address: feed, abi: chainlinkAggregatorAbi, functionName: 'decimals' }),
    ])

    return Number(formatUnits(roundData[1], decimals))
  } catch {
    return null // USD display is cosmetic — never let a feed failure break the page
  }
}

export const getUsdPrices = async (): Promise<UsdPrices> => {
  const [eth, eur] = await Promise.all([
    readFeed(CHAINLINK_FEEDS.ETH_USD),
    readFeed(CHAINLINK_FEEDS.EUR_USD),
  ])

  return { eth, eur }
}

export const estimateUsdValue = (position: FleetPosition, prices: UsdPrices): number | null => {
  const amount = Number(formatUnits(position.totalAssets, position.asset.decimals))
  const symbol = position.asset.symbol.toUpperCase()

  if (DOLLAR_STABLE_SYMBOLS.has(symbol)) return amount
  if (ETH_SYMBOLS.has(symbol) && prices.eth !== null) return amount * prices.eth
  if (EUR_SYMBOLS.has(symbol) && prices.eur !== null) return amount * prices.eur

  return null
}
