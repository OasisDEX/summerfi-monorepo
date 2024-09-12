import { getChainInfoByChainId } from '@summerfi/sdk-common'

export const getChainInfoHandler = (chainId?: number) => () => {
  if (chainId == null) {
    throw new Error('ChainId is not defined')
  }

  return getChainInfoByChainId(chainId)
}
