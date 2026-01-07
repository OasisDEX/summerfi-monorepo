import type { ChainId } from '@summerfi/sdk-common'
import { defineChain, extractChain } from 'viem'
import { arbitrum, base, mainnet, optimism, sonic } from 'viem/chains'

export const hyperEvm = defineChain({
  id: 999,
  name: 'HyperEVM',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.hypurrscan.io'] },
  },
  blockExplorers: {
    default: {
      name: 'Hyperliquid Explorer',
      url: 'https://hyperevmscan.io/',
    },
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensUniversalResolver: {
      address: '0xE4Acdd618deED4e6d2f03b9bf62dc6118FC9A4da',
      blockCreated: 16773775,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14353601,
    },
  },
})

export const getViemChain = (chainId: ChainId) => {
  return extractChain({
    chains: [base, mainnet, arbitrum, sonic, optimism, hyperEvm],
    id: chainId,
  })
}
