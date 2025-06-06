import { getChainInfoByChainId } from '@summer_fi/sdk-client'

export const getChainInfoHandler = (chainId?: number) => () => {
  if (chainId == null) {
    throw new Error('ChainId is not defined')
  }

  return getChainInfoByChainId(chainId)
}
