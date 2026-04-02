import { arbitrum, base, type Chain, hyperliquid, mainnet, sonic } from 'viem/chains'

export const getChainById: (chainId: number) => Chain = (chainId: number) => {
  const mappedChain = {
    [arbitrum.id]: arbitrum,
    [base.id]: base,
    [hyperliquid.id]: hyperliquid,
    [mainnet.id]: mainnet,
    [sonic.id]: sonic,
  }[chainId]

  if (!mappedChain) {
    throw new Error(`Unsupported chainId: ${chainId}`)
  }

  return mappedChain
}
