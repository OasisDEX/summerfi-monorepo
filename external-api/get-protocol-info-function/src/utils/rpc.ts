import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'

const logger = new Logger({ serviceName: 'get-protocol-info-function' })

export function getRpcUrl(chainId: ChainId): string {
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
    [ChainId.HYPERLIQUID]: 'hyperliquid',
  }[chainId]

  if (!networkName) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }

  return `${baseUrl}?network=${networkName}`
}
