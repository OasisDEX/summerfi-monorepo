import type { BundleAction, BundleParams } from '@ensofinance/sdk'
import { EnsoClient as EnsoSDKClient } from '@ensofinance/sdk'
import { LoggingService, type AddressValue } from '@summerfi/sdk-common'

const ENSO_API_KEY = process.env.ENSO_API_KEY

/**
 * @class EnsoClient
 * @description Wrapper for Enso Finance SDK client
 */
export class EnsoClient {
  private static instance: EnsoSDKClient | null = null

  /**
   * Get or create Enso client instance
   */
  static getClient(): EnsoSDKClient {
    if (!ENSO_API_KEY) {
      LoggingService.error('ENSO_API_KEY is not defined, Enso client will not work')
      throw new Error('ENSO_API_KEY is not defined')
    }

    if (!this.instance) {
      this.instance = new EnsoSDKClient({
        apiKey: ENSO_API_KEY,
      })
      LoggingService.debug('EnsoClient initialized')
    }

    return this.instance
  }

  /**
   * Get bundle data for cross-chain operations
   */
  static async getBundleData(
    config: {
      chainId: number
      fromAddress: AddressValue
      spender: AddressValue
      routingStrategy?: 'router' | 'delegate'
    },
    actions: BundleAction[],
  ) {
    const client = this.getClient()
    const params: Partial<BundleParams> &
      Pick<BundleParams, 'chainId' | 'fromAddress' | 'spender'> = {
      chainId: config.chainId,
      fromAddress: config.fromAddress as `0x${string}`,
      spender: config.spender as `0x${string}`,
    }
    if (config.routingStrategy) {
      params.routingStrategy = config.routingStrategy
    }
    return client.getBundleData(params as BundleParams, actions)
  }
}

export type { BundleAction }
