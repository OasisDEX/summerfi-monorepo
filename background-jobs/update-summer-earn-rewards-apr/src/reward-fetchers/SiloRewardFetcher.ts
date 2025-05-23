import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { IRewardFetcher } from './IRewardFetcher'
import { RewardRate } from '../rewards-service'

interface SiloProgram {
  rewardTokenSymbol: string
  apr: string
}

interface SiloVaultReward {
  vaultAddress: string
  programs?: SiloProgram[]

  chainKey?: string
  protocolKey?: string
  vaultSymbol?: string
  vaultName?: string
}

export class SiloRewardFetcher implements IRewardFetcher {
  private readonly SILO_API_URL = 'https://v2.silo.finance/api/detailed-vault'
  private readonly logger: Logger
  private readonly chainIdToSiloNetworkName: Partial<Record<ChainId, string>> = {
    [ChainId.SONIC]: 'sonic',
  }
  private readonly REQUEST_DELAY_MS = 100 // Delay between requests to be gentle on the API

  constructor(logger: Logger) {
    this.logger = logger
  }

  async getRewardRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, RewardRate[]>> {
    try {
      const networkName = this.chainIdToSiloNetworkName[chainId]
      if (!networkName) {
        this.logger.warn(`[SiloRewardFetcher] No network name found for chainId: ${chainId}`)
        return Object.fromEntries(products.map((product) => [product.id, []]))
      }

      const productToSiloResponse: Record<string, SiloVaultReward> = {}

      // Fetch data for each product sequentially with a small delay
      for (const product of products) {
        try {
          this.logger.info(
            `[SiloRewardFetcher] Fetching rewards for vault: ${product.pool} on ${networkName}`,
          )
          const response = await this.fetchWithRetry(
            `${this.SILO_API_URL}/${networkName}-${product.pool}`,
          )

          const rawData = await response.json()

          // Check if response is valid
          if (typeof rawData === 'string' || !rawData || !rawData.vaultAddress) {
            this.logger.warn(`[SiloRewardFetcher] Invalid response for vault: ${product.pool}`)
            continue
          }

          productToSiloResponse[product.id] = rawData as SiloVaultReward

          // Add a small delay between requests to avoid overwhelming the API
          if (products.indexOf(product) < products.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, this.REQUEST_DELAY_MS))
          }
        } catch (error) {
          this.logger.error(`[SiloRewardFetcher] Error fetching data for vault ${product.pool}:`, {
            error: error as Error,
          })
          // Continue with next product even if this one fails
        }
      }

      // Process responses
      return products.reduce(
        (acc, product) => {
          const vaultData = productToSiloResponse[product.id]

          if (!vaultData || !vaultData.programs || !Array.isArray(vaultData.programs)) {
            acc[product.id] = []
            return acc
          }

          acc[product.id] = vaultData.programs
            .filter((program) => program.rewardTokenSymbol && program.apr)
            .map((program, index) => {
              // Convert APR from 18 decimals and multiply by 100 for percentage
              const parsedApr = parseFloat(program.apr)
              if (isNaN(parsedApr)) {
                this.logger.warn(
                  `[SiloRewardFetcher] Invalid APR value for ${program.rewardTokenSymbol}: ${program.apr}`,
                )
                return null
              }
              const aprValue = (parsedApr / 1e18) * 100

              return {
                rewardToken: '0x0000000000000000000000000000000000000000', // Zero address as we don't know token addresses
                rate: aprValue.toString(),
                index,
                token: {
                  address: '0x0000000000000000000000000000000000000000',
                  symbol: program.rewardTokenSymbol,
                  decimals: 18,
                  precision: (10n ** BigInt(18)).toString(),
                },
              }
            })
            .filter((reward): reward is RewardRate => reward !== null) // Remove null values

          return acc
        },
        {} as Record<string, RewardRate[]>,
      )
    } catch (error) {
      this.logger.error('[SiloRewardFetcher] Error fetching Silo rewards:', {
        error: error as Error,
      })
      return Object.fromEntries(products.map((product) => [product.id, []]))
    }
  }

  private async fetchWithRetry(url: string, options?: RequestInit): Promise<Response> {
    const maxRetries = 5
    const initialDelay = 2000 // 2 seconds
    const backoffFactor = 2
    let attempt = 0

    while (attempt <= maxRetries) {
      try {
        const response = await fetch(url, options)

        // Handle 500 errors without retry (wrong address)
        if (response.status === 500) {
          this.logger.warn(
            `[SiloRewardFetcher] 500 error for ${url} - likely invalid vault address`,
          )
          throw new Error(`Invalid vault address: ${response.status}`)
        }

        if (response.ok) return response

        // For other errors, continue with retry logic
        const text = await response.text()
        throw new Error(`HTTP error! status: ${response.status} ${text}`)
      } catch (error) {
        // If it's a 500 error, don't retry
        if (error instanceof Error && error.message.includes('Invalid vault address')) {
          throw error
        }

        attempt++
        if (attempt > maxRetries) {
          this.logger.error(`[SiloRewardFetcher] Max retries (${maxRetries}) reached for ${url}`)
          throw error
        }

        const delay = initialDelay * Math.pow(backoffFactor, attempt - 1)
        this.logger.warn(`[SiloRewardFetcher] Attempt ${attempt} failed. Retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
    throw new Error('Unexpected error in fetchWithRetry')
  }
}
