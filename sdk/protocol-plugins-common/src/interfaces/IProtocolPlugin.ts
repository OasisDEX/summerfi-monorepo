import { ChainInfo, IPosition, IPositionIdData, Maybe } from '@summerfi/sdk-common/common'
import {
  ProtocolName,
  ILendingPool,
  ILendingPoolIdData,
  ILendingPoolInfo,
} from '@summerfi/sdk-common/protocols'
import { type IProtocolPluginContext } from './IProtocolPluginContext'
import { steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder, ActionBuildersMap } from '../types/StepBuilderTypes'
import { IUser } from '@summerfi/sdk-common/user'
import { IExternalPosition, IPositionsManager, TransactionInfo } from '@summerfi/sdk-common/orders'

/**
 * @interface IProtocolPlugin
 * @description Interface to be implemented by a protocol plugin to provide protocol-specific functionality
 */
export interface IProtocolPlugin {
  protocolName: ProtocolName
  supportedChains: ChainInfo[]
  stepBuilders: Partial<ActionBuildersMap>
  context: IProtocolPluginContext

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
   * @name getPosition
   * @description Gets the position for the given position ID
   * @param positionId The position ID for the specific protocol
   * @returns The position for the specific protocol
   */
  getPosition(positionId: IPositionIdData): Promise<IPosition>

  /** ACTION BUILDERS */

  /**
   * @name getActionBuilder
   * @description Gets the action builder for the given step
   * @param step The simulation step for which to get the action builder
   * @returns The action builder for the given step for the specific protocol, or undefined if not found
   */
  getActionBuilder<StepType extends steps.Steps>(step: StepType): Maybe<ActionBuilder<StepType>>

  /** IMPORT POSITION */

  /**
   * @name getImportPositionTransaction
   * @description Gets the transaction to import the given external position
   * @param params The parameters to get the import position transaction
   * @returns The transaction to import the given external position, or undefined if not supported
   */
  getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>>
}
