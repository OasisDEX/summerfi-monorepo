import { ChainId } from '@summerfi/serverless-shared'
import { getSdk } from './generated/client'
import {type InterestRate as InterestRateType } from './generated/client'
export interface SubgraphClientConfig {
  chainId: ChainId
  urlBase: string
}

export type SubgraphClient = ReturnType<typeof getSdk>

export type InterestRate = InterestRateType
