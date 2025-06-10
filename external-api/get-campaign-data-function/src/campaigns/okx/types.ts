import { UserPositionsQuery } from '@summerfi/summer-earn-protocol-subgraph'

export interface OkxQuestResult {
  questNumber: number
  completed: boolean
  debugData?: Record<string, unknown>
}

export type OkxQuestHandler = (
  questNumber: number,
  walletAddress: string,
  subgraphBase: string,
  positions: UserPositionsQuery['positions'],
) => Promise<OkxQuestResult[]>
