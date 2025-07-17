import { Address, type ChainId } from '@summerfi/sdk-common'
import { getViemChain } from './getViemChain'

export const getMulticall3Address = (chainId: ChainId) => {
  const chain = getViemChain(chainId)
  return Address.createFromEthereum({
    value: chain.contracts.multicall3.address,
  })
}
