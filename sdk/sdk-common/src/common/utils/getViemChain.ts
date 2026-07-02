import type { ChainId } from '@summerfi/sdk-common'
import { defineChain, extractChain } from 'viem'
import { arbitrum, base, mainnet, optimism, sonic } from 'viem/chains'

/** viem chain definition for HyperEVM (Hyperliquid), which is not bundled in `viem/chains`. */
export const hyperliquid = defineChain({
  id: 999,
  name: 'HyperEVM',
  nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.hyperliquid.xyz/evm'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HyperEVMScan',
      url: 'https://hyperevmscan.io',
      apiUrl: 'https://api.hyperevmscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 13051,
    },
  },
})

/**
 * Resolves the viem chain definition for a supported chain id.
 *
 * @param chainId - The chain id to resolve.
 * @returns The matching viem chain definition.
 */
export const getViemChain = (chainId: ChainId) => {
  return extractChain({
    chains: [base, mainnet, arbitrum, sonic, optimism, hyperliquid],
    id: chainId,
  })
}
