import type { ChainId } from '@summerfi/sdk-common'
import { extractChain } from 'viem'
import { arbitrum, base, mainnet, optimism, sonic } from 'viem/chains'

export const getViemChain = (chainId: ChainId) => {
  return extractChain({
    chains: [base, mainnet, arbitrum, sonic, optimism],
    id: chainId,
  })
}
