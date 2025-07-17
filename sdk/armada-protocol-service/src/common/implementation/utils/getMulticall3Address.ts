import { Address, type ChainId } from '@summerfi/sdk-common'
import { getViemChain } from './getViemChain'

export const getMulticall3Address = (chainId: ChainId) => {
  const chain = getViemChain(chainId)
  if (!chain.contracts?.multicall3?.address) {
    throw new Error(`Multicall3 not configured for chain ${chainId}`)
  }
  return Address.createFromEthereum({
    value: chain.contracts.multicall3.address,
  })
}
