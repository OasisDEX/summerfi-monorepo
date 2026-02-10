import {
  Product,
  SubgraphClient as RatesSubgraphClient,
} from '@summerfi/summer-earn-rates-subgraph'
import { Protocol } from '.'
import { ChainId, NetworkByChainID } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { SiloRewardFetcher } from './reward-fetchers/SiloRewardFetcher'
import { CompoundRewardFetcher } from './reward-fetchers/CompoundRewardFetcher'
import { FluidRewardFetcher } from './reward-fetchers/FluidRewardFetcher'
import { MorphoRewardFetcher } from './reward-fetchers/MorphoRewardFetcher'
import { MorphoV2RewardFetcher } from './reward-fetchers/MorphoV2RewardFetcher'

interface AaveMeritResponse {
  previousAPR: number | null
  currentAPR: {
    actionsAPR: Record<string, number>
  }
}

export interface MerkleDistribution {
  identifier: string
  chainId: number
  aprRecord: {
    cumulated: number
    breakdowns: {
      value: number
    }[]
  }
  rewardsRecord: {
    breakdowns: {
      token: {
        address: string
        symbol: string
        decimals: number
      }
      value: number
    }[]
  }
}

export interface RewardRate {
  rewardToken: string
  rate: string
  index: number
  token: {
    address: string
    symbol: string
    decimals: number
    precision: string
  }
}

interface EulerReward {
  startTimestamp: number
  endTimestamp: number
  apr: number
  rewardToken: {
    address: string
    symbol: string
    decimals: number
  }
}
interface RetryConfig {
  maxRetries?: number
  initialDelay?: number
  backoffFactor?: number
}

export class RewardsService {
  private readonly EULER_API_URL = 'https://app.euler.finance/api/v1/rewards?chainId='
  private readonly GEARBOX_API_URL =
    'https://api.merkl.xyz/v4/opportunities?mainProtocolId=gearbox&status=LIVE&'
  private readonly DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 5,
    initialDelay: 2000, // 2 seconds
    backoffFactor: 2,
  }
  private readonly REWARD_RATIO_MAP = {
    reul: 0.5,
    xsilo: 0.49,
    '*': 0.97,
  }
  private readonly ONE_HOUR_IN_SECONDS = 3600
  private readonly logger: Logger
  private readonly ratesSubgraphClient: RatesSubgraphClient
  private readonly siloRewardFetcher: SiloRewardFetcher
  private readonly compoundRewardFetcher: CompoundRewardFetcher
  private readonly fluidRewardFetcher: FluidRewardFetcher
  private readonly morphoRewardFetcher: MorphoRewardFetcher
  private readonly morphoV2RewardFetcher: MorphoV2RewardFetcher

  constructor(logger: Logger, ratesSubgraphClient: RatesSubgraphClient) {
    this.logger = logger
    this.ratesSubgraphClient = ratesSubgraphClient
    this.siloRewardFetcher = new SiloRewardFetcher(logger)
    this.compoundRewardFetcher = new CompoundRewardFetcher(logger)
    this.fluidRewardFetcher = new FluidRewardFetcher(logger, { blacklistSymbols: [] })
    this.morphoRewardFetcher = new MorphoRewardFetcher(logger)
    this.morphoV2RewardFetcher = new MorphoV2RewardFetcher(logger)
  }

  async getRewardRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, RewardRate[]>> {
    this.logger.debug(
      `[RewardsService] Getting reward rates for ${products.length} products on chain ${chainId}`,
    )

    // Group products by protocol for batch processing
    const protocolGroups = products.reduce(
      (acc: Record<Protocol, Product[]>, product) => {
        const protocol = product.protocol as Protocol // Ensure product.protocol is of type Protocol
        acc[protocol] = acc[protocol] || []
        acc[protocol].push(product)
        return acc
      },
      {} as Record<Protocol, Product[]>,
    )

    const results: Record<string, RewardRate[]> = {}

    // Process Morpho products
    if (protocolGroups[Protocol.Morpho]?.length) {
      const morphoResults = await this.morphoRewardFetcher.getRewardRates(
        protocolGroups[Protocol.Morpho],
        chainId,
      )
      Object.assign(results, morphoResults)
    }

    // Process Morpho V2 products
    if (protocolGroups[Protocol.MorphoV2]?.length) {
      const morphoV2Results = await this.morphoV2RewardFetcher.getRewardRates(
        protocolGroups[Protocol.MorphoV2],
        chainId,
      )
      Object.assign(results, morphoV2Results)
    }

    // Process Euler products in batch
    if (protocolGroups[Protocol.Euler]?.length) {
      const eulerResults = await this.getEulerRewardsBatch(protocolGroups[Protocol.Euler], chainId)
      Object.assign(results, eulerResults)
    }

    if (protocolGroups[Protocol.Aave]?.length) {
      const aaveResults = await this.getAaveMeritRewardsBatch(
        protocolGroups[Protocol.Aave],
        chainId,
      )
      Object.assign(results, aaveResults)
    }

    if (protocolGroups[Protocol.Gearbox]?.length) {
      const gearboxResults = await this.getGearboxRewardsBatch(
        protocolGroups[Protocol.Gearbox],
        chainId,
      )
      Object.assign(results, gearboxResults)
    }

    if (protocolGroups[Protocol.Silo]?.length) {
      const siloResults = await this.siloRewardFetcher.getRewardRates(
        protocolGroups[Protocol.Silo],
        chainId,
      )
      Object.assign(results, siloResults)
    }

    if (protocolGroups[Protocol.CompoundV3]?.length) {
      const compoundResults = await this.compoundRewardFetcher.getRewardRates(
        protocolGroups[Protocol.CompoundV3],
        chainId,
      )
      Object.assign(results, compoundResults)
    }

    if (protocolGroups[Protocol.Fluid]?.length) {
      const fluidResults = await this.fluidRewardFetcher.getRewardRates(
        protocolGroups[Protocol.Fluid],
        chainId,
      )
      Object.assign(results, fluidResults)
    }

    // we call it for all arks i ncase there are additional rewards calcualted with onchian data
    const subgraphResults = await this.getArksRewardsBatch(products)

    // combine results and subgraph results
    const combinedResults = Object.entries(subgraphResults).reduce(
      (acc, [productId, rewards]) => {
        if (results[productId]) {
          acc[productId] = [...results[productId], ...rewards]
        } else {
          acc[productId] = rewards
        }
        return acc
      },
      {} as Record<string, RewardRate[]>,
    )

    // apply reward ratio to each reward rate
    const finalResults = Object.entries(combinedResults).reduce(
      (acc, [productId, rewards]) => {
        acc[productId] = rewards.map((reward) => ({
          ...reward,
          rate: this._rewardRatio(reward.rate, reward.token.symbol).toString(),
        }))
        return acc
      },
      {} as Record<string, RewardRate[]>,
    )

    return finalResults
  }

  private async fetchWithRetry(
    url: string,
    options?: RequestInit,
    retryConfig?: RetryConfig,
  ): Promise<Response> {
    const config = { ...this.DEFAULT_RETRY_CONFIG, ...retryConfig }
    let attempt = 0

    while (attempt <= config.maxRetries!) {
      try {
        const response = await fetch(url, options)
        if (response.ok) return response
        try {
          const text = await response.text()
          throw new Error(`HTTP error! status: ${response.status} ${text}`)
        } catch (error) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } catch (error) {
        attempt++
        if (attempt > config.maxRetries!) {
          console.error(`[RewardsService] Max retries (${config.maxRetries}) reached for ${url}`)
          throw error
        }
        console.log(error)
        const delay = config.initialDelay! * Math.pow(config.backoffFactor!, attempt - 1)
        console.warn(`[RewardsService] Attempt ${attempt} failed. Retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
    throw new Error('Unexpected error in fetchWithRetry')
  }

  private async getAaveMeritRewardsBatch(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, RewardRate[]>> {
    try {
      const response = await this.fetchWithRetry('https://apps.aavechan.com/api/merit/aprs')
      const data = (await response.json()) as AaveMeritResponse

      const network = chainId === ChainId.MAINNET ? 'ethereum' : NetworkByChainID[chainId]
      const rewards: Record<string, RewardRate[]> = Object.fromEntries(
        products.map((product) => [product.id, []]),
      )
      for (const product of products) {
        // lowercased without specialcharacters
        const normalizedSymbol = product.token.symbol.toLowerCase().replace(/[^a-z0-9]/g, '')
        const currentApr = data.currentAPR.actionsAPR[`${network}-supply-${normalizedSymbol}`]
        if (!currentApr) {
          continue
        }
        const rewardRate = {
          rewardToken: '0x0000000000000000000000000000000000000000',
          rate: currentApr.toString(),
          index: 0,
          token: {
            address: '0x0000000000000000000000000000000000000000',
            symbol: 'Aave Merit',
            decimals: 18,
            precision: (10n ** BigInt(18)).toString(),
          },
        }
        rewards[product.id] = [rewardRate]
      }

      return rewards
    } catch (error) {
      console.error('[RewardsService] Error fetching Aave Merit rewards:', error)
      return Object.fromEntries(products.map((product) => [product.id, []]))
    }
  }

  private async getArksRewardsBatch(products: Product[]): Promise<Record<string, RewardRate[]>> {
    const productIds = products.map((product) => product.id)
    const subgraphResults = await this.ratesSubgraphClient.GetArksRewardsRates({ productIds })

    const rewards: Record<string, RewardRate[]> = Object.fromEntries(
      products.map((product) => [product.id, []]),
    )
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000)
    const timestampHourAgoInSeconds = currentTimestampInSeconds - this.ONE_HOUR_IN_SECONDS
    for (const product of products) {
      const subgraphResult = subgraphResults.products.find((p) => p.id === product.id)
      if (subgraphResult && subgraphResult.rewardsInterestRates.length > 0) {
        // Get the most recent timestamp from the first rate (since they're sorted desc)
        const latestTimestamp = subgraphResult.rewardsInterestRates[0].timestamp
        // if the latest timestamp is more than 1 hour ago, skip the product
        if (parseInt(latestTimestamp) < timestampHourAgoInSeconds) {
          continue
        }

        // Filter rates to only include those from the latest timestamp
        const latestRates = subgraphResult.rewardsInterestRates
          .filter((r) => r.timestamp === latestTimestamp)
          .map((r, index) => ({
            rewardToken: r.rewardToken.address,
            rate: r.rate.toString(),
            index,
            token: {
              address: r.token.address,
              symbol: r.token.symbol,
              decimals: parseInt(r.token.decimals),
              precision: (10n ** BigInt(parseInt(r.token.decimals))).toString(),
            },
          }))

        rewards[product.id] = latestRates
      }
    }
    return rewards
  }

  private async getGearboxRewardsBatch(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, RewardRate[]>> {
    try {
      const MERKL_API_URL = `${this.GEARBOX_API_URL}&chainId=${chainId}`
      const response = await this.fetchWithRetry(MERKL_API_URL)
      const data = (await response.json()) as MerkleDistribution[]
      const rewardRates: Record<string, RewardRate[]> = Object.fromEntries(
        products.map((product) => [product.id, []]),
      )
      for (const product of products) {
        const distribution = data.find(
          (d) => d.identifier.toLowerCase() === product.pool.toLowerCase(),
        )
        if (!distribution) {
          continue
        }
        const rewards = distribution.rewardsRecord.breakdowns.map((reward, index) => ({
          rewardToken: reward.token.address,
          rate: distribution.aprRecord.breakdowns[index].value.toString(),
          index,
          token: {
            address: reward.token.address,
            symbol: reward.token.symbol,
            decimals: reward.token.decimals,
            precision: (10n ** BigInt(reward.token.decimals)).toString(),
          },
        }))
        if (rewards.length > 0) {
          rewardRates[product.id] = rewards
        }
      }

      return rewardRates
    } catch (error) {
      console.error('[RewardsService] Error fetching Gearbox rewards:', error)
      return Object.fromEntries(products.map((product) => [product.id, []]))
    }
  }

  private async getEulerRewardsBatch(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, RewardRate[]>> {
    const currentTimestamp = Math.floor(Date.now() / 1000)
    this.logger.debug(
      `[RewardsService] Getting Euler rewards for ${products.length} products on chain ${chainId}`,
    )

    try {
      const response = await this.fetchWithRetry(`${this.EULER_API_URL}${chainId}`)
      const data = (await response
        .json()
        .then((originalData) =>
          Object.fromEntries(
            Object.entries(originalData).map(([key, value]) => [key.toLowerCase(), value]),
          ),
        )) as Record<string, EulerReward[]>

      return products.reduce(
        (acc, product) => {
          const rewards = data[product.pool.toLowerCase()] || []

          acc[product.id] = rewards
            .filter(
              (reward) =>
                reward.startTimestamp <= currentTimestamp &&
                reward.endTimestamp >= currentTimestamp,
            )
            .map((reward, index) => ({
              rewardToken: reward.rewardToken.address,
              rate: reward.apr.toString(),
              index,
              token: {
                address: reward.rewardToken.address,
                symbol: reward.rewardToken.symbol,
                decimals: reward.rewardToken.decimals,
                precision: (10n ** BigInt(reward.rewardToken.decimals)).toString(),
              },
            }))

          return acc
        },
        {} as Record<string, RewardRate[]>,
      )
    } catch (error) {
      console.error('[RewardsService] Error fetching Euler rewards:', error)
      return Object.fromEntries(products.map((product) => [product.id, []]))
    }
  }

  private _rewardRatio(_rate: string, symbol: string): number {
    const rate = parseFloat(_rate)
    if (symbol.toLowerCase() === 'reul') {
      return rate * this.REWARD_RATIO_MAP['reul']
    }
    if (symbol.toLowerCase() === 'xsilo') {
      return rate * this.REWARD_RATIO_MAP['xsilo']
    }
    return rate * this.REWARD_RATIO_MAP['*']
  }
}
