import { ChainId } from '@summerfi/serverless-shared'
import { createClient } from './createClient'
import { supportedChains } from './utils/supportedChains'
import { SubgraphClient } from './types'

export const getAllClients = (baseUrl: string): Record<ChainId, SubgraphClient> => {
  return supportedChains.reduce(
    (acc, chainId) => {
      acc[chainId as ChainId] = createClient(chainId, baseUrl)
      return acc
    },
    {} as Record<ChainId, SubgraphClient>,
  )
}
