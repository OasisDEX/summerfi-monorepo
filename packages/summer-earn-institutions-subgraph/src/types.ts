import { ChainId } from '@summerfi/serverless-shared'
import {
  getSdk,
  Vault,
  VaultsQuery as GetVaultsQuery,
  HistoricalVaultsQuery as HistoricalVaultsQueryType,
} from './generated/client'

export interface SubgraphClientConfig {
  chainId: ChainId
  urlBase: string
}
export type VaultsQuery = GetVaultsQuery
export type SubgraphClient = ReturnType<typeof getSdk>
export type Arks = Vault['arks']
export type Ark = Arks[number]

export type HistoricalVaultsQuery = HistoricalVaultsQueryType
