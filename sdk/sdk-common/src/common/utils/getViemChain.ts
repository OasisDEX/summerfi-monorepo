import type { ChainId } from '@summerfi/sdk-common'
import { extractChain } from 'viem'
import { arbitrum, base, mainnet, optimism, sonic, hyperEvm } from 'viem/chains'

export const getViemChain = (chainId: ChainId) => {
  return extractChain({
    chains: [base, mainnet, arbitrum, sonic, optimism, hyperEvm],
    id: chainId,
  })
}
