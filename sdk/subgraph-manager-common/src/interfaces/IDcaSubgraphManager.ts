import type { ChainId } from '@summerfi/sdk-common'
import type { GetExecutionsQuery, GetStrategiesQuery } from '../generated/dca/client'

/**
 * @name IDcaSubgraphManager
 * @description Interface for the DCA subgraph manager
 */
export interface IDcaSubgraphManager {
  /**
   * @name getStrategies
   * @description Get all DCA strategies for a given chain
   *
   * @param chainId target chain
   *
   * @returns GetStrategiesQuery
   *
   * @throws Error
   */
  getStrategies(params: { chainId: ChainId }): Promise<GetStrategiesQuery>

  /**
   * @name getExecutions
   * @description Get all executions for a given DCA strategy
   *
   * @param chainId target chain
   * @param strategyId the strategy ID to fetch executions for
   *
   * @returns GetExecutionsQuery
   *
   * @throws Error
   */
  getExecutions(params: { chainId: ChainId; strategyId: string }): Promise<GetExecutionsQuery>
}
