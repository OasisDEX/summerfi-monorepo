import { Logger } from '@aws-lambda-powertools/logger'
import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { IRewardFetcher } from './IRewardFetcher'
import { RewardRate } from '../rewards-service'

interface RetryConfig {
  maxRetries?: number
  initialDelay?: number
  backoffFactor?: number
  nonRetryableStatuses?: number[]
}

export abstract class BaseRewardFetcher implements IRewardFetcher {
  protected readonly logger: Logger
  protected readonly DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 5,
    initialDelay: 2000, // 2 seconds
    backoffFactor: 2,
    nonRetryableStatuses: [400, 401, 403, 404], // Don't retry client errors
  }

  constructor(logger: Logger) {
    this.logger = logger
  }

  abstract getRewardRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, RewardRate[]>>

  protected async fetchWithRetry(
    url: string,
    options?: RequestInit,
    retryConfig?: Partial<RetryConfig>,
  ): Promise<Response> {
    const config = { ...this.DEFAULT_RETRY_CONFIG, ...retryConfig }
    let attempt = 0

    while (attempt <= config.maxRetries!) {
      try {
        const response = await fetch(url, options)

        // Check for non-retryable status codes
        if (config.nonRetryableStatuses?.includes(response.status)) {
          this.logger.warn(
            `[${this.constructor.name}] Non-retryable error ${response.status} for ${url}`,
          )
          throw new Error(`Non-retryable error: ${response.status}`)
        }

        if (response.ok) return response

        // For other errors, continue with retry logic
        const text = await response.text()
        throw new Error(`HTTP error! status: ${response.status} ${text}`)
      } catch (error) {
        // If it's a non-retryable error, don't retry
        if (error instanceof Error && error.message.includes('Non-retryable error')) {
          throw error
        }

        attempt++
        if (attempt > config.maxRetries!) {
          this.logger.error(
            `[${this.constructor.name}] Max retries (${config.maxRetries}) reached for ${url}`,
          )
          throw error
        }

        const delay = config.initialDelay! * Math.pow(config.backoffFactor!, attempt - 1)
        this.logger.warn(
          `[${this.constructor.name}] Attempt ${attempt} failed. Retrying in ${delay}ms...`,
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
    throw new Error('Unexpected error in fetchWithRetry')
  }

  protected createEmptyResults(products: Product[]): Record<string, RewardRate[]> {
    return Object.fromEntries(products.map((product) => [product.id, []]))
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  protected validateAndParseNumber(value: string | number, fieldName: string): number | null {
    const parsed = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(parsed)) {
      this.logger.warn(`[${this.constructor.name}] Invalid ${fieldName} value: ${value}`)
      return null
    }
    return parsed
  }
}
