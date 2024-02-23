import { ChainId } from '@summerfi/sdk-common/chains'
import {
  OneInchSwapProvider,
  OneInchSwapProviderConfig,
  SwapManager,
} from '~swap-service/implementation'

function getOneInchConfig(): {
  config: OneInchSwapProviderConfig
  chainIds: ChainId[]
} {
  if (!process.env.ONE_INCH_API_KEY) {
    throw new Error('ONE_INCH_API_KEY env variable is required')
  }
  if (!process.env.ONE_INCH_API_VERSION) {
    throw new Error('ONE_INCH_API_VERSION env variable is required')
  }
  if (!process.env.ONE_INCH_API_URL) {
    throw new Error('ONE_INCH_API_URL env variable is required')
  }
  if (!process.env.ONE_INCH_ALLOWED_SWAP_PROTOCOLS) {
    throw new Error('ONE_INCH_ALLOWED_SWAP_PROTOCOLS env variable is required')
  }
  if (!process.env.ONE_INCH_SWAP_CHAIN_IDS) {
    throw new Error('ONE_INCH_SWAP_CHAIN_IDS env variable is required')
  }

  return {
    config: {
      apiUrl: process.env.ONE_INCH_API_URL,
      version: process.env.ONE_INCH_API_VERSION,
      allowedSwapProtocols: process.env.ONE_INCH_ALLOWED_SWAP_PROTOCOLS.split(','),
      apiKey: process.env.ONE_INCH_API_KEY,
    },
    chainIds: process.env.ONE_INCH_SWAP_CHAIN_IDS.split(',').map((id) => parseInt(id)),
  }
}

export function getSwapManager() {
  const { config: oneInchConfig, chainIds: oneInchChainIds } = getOneInchConfig()

  const oneInchSwapProvider = new OneInchSwapProvider(oneInchConfig)

  return new SwapManager([
    {
      provider: oneInchSwapProvider,
      chainIds: oneInchChainIds,
    },
  ])
}
