import {
  ChainInfo,
  Maybe,
  ProtocolName,
  ILendingPool,
  ILendingPoolIdData,
  ILendingPoolInfo,
  ILendingPosition,
  ILendingPositionIdData,
  IExternalLendingPosition,
  IPositionsManager,
  TransactionInfo,
  SimulationSteps,
  steps,
  IUser,
} from '@summerfi/sdk-common'

import { ActionBuildersMap, FilterStep, IActionBuilder } from './IActionBuilder'
import { type IProtocolPluginContext } from './IProtocolPluginContext'

/**
 * @interface IProtocolPlugin
 * @description Interface to be implemented by a protocol plugin to provide protocol-specific functionality
 */
export interface IProtocolPlugin {
  protocolName: ProtocolName
  supportedChains: ChainInfo[]
  stepBuilders: Partial<ActionBuildersMap>

  /** INITIALIZATION */
  initialize(params: { context: IProtocolPluginContext }): void

  /** LENDING POOLS */

  /**
   * @name getLendingPool
   * @description Gets the lending pool for the given pool ID
   * @param poolId The pool ID
   * @returns The lending pool for the specific protocol
   */
  getLendingPool(poolId: ILendingPoolIdData): Promise<ILendingPool>

  /**
   * @name getLendingPoolInfo
   * @description Gets the lending pool extended information for the given pool ID
   * @param poolId The pool ID
   * @returns The lending pool info for the specific protocol
   */
  getLendingPoolInfo(poolId: ILendingPoolIdData): Promise<ILendingPoolInfo>

  /** POSITIONS */

  /**
   * @name getLendingPosition
   * @description Gets the lending position for the given lending position ID
   * @param positionId The lending position ID for the specific protocol
   * @returns The lending position for the specific protocol
   */
  getLendingPosition(positionId: ILendingPositionIdData): Promise<ILendingPosition>

  /** ACTION BUILDERS */

  /**
   * @name getActionBuilder
   * @description Gets the action builder for the given step
   * @param step The simulation step for which to get the action builder
   * @returns The action builder for the given step for the specific protocol, or undefined if not found
   */
  getActionBuilder<
    StepType extends SimulationSteps,
    Step extends FilterStep<StepType, steps.Steps>,
  >(
    stepType: StepType,
  ): Maybe<IActionBuilder<Step>>

  /** IMPORT POSITION */

  /**
   * @name getImportPositionTransaction
   * @description Gets the transaction to import the given external position
   * @param params The parameters to get the import position transaction
   * @returns The transaction to import the given external position, or undefined if not supported
   */
  getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalLendingPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>>
}
