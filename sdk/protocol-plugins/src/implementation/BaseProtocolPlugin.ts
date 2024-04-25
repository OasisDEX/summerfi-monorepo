import {
  ActionBuilder,
  ActionBuildersMap,
  IProtocolPlugin,
  IProtocolPluginContext,
} from '@summerfi/protocol-plugins-common'
import {
  ChainInfo,
  Maybe,
  IPosition,
  IPositionId,
  IPositionIdData,
} from '@summerfi/sdk-common/common'
import { IExternalPosition, IPositionsManager, TransactionInfo } from '@summerfi/sdk-common/orders'
import {
  ProtocolName,
  ILendingPool,
  ILendingPoolId,
  ILendingPoolIdData,
} from '@summerfi/sdk-common/protocols'
import { steps } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-common/user'

/**
 * @class BaseProtocolPlugin
 * @description Base class for all protocol plugins
 *
 * It provides some extra functionality to validate input data coming from the SDK client
 */
export abstract class BaseProtocolPlugin implements IProtocolPlugin {
  /** Name of the protocol that the plugin is implementing */
  abstract readonly protocolName: ProtocolName
  /** List of supported chains for the protocol */
  abstract readonly supportedChains: ChainInfo[]
  /** Map of action builders for the protocol */
  abstract readonly stepBuilders: Partial<ActionBuildersMap>

  /** These properties are initialized in the constructor */
  readonly context: IProtocolPluginContext
  readonly deploymentConfigTag: string

  protected constructor(params: { context: IProtocolPluginContext; deploymentConfigTag?: string }) {
    this.context = params.context
    this.deploymentConfigTag = params.deploymentConfigTag ?? 'standard'
  }

  // Short alias for the context
  protected get ctx(): IProtocolPluginContext {
    return this.context
  }

  /** VALIDATORS */

  /**
   * @name validateLendingPoolId
   * @description Validates that the candidate is a valid lending pool ID for the specific protocol
   * @param candidate The candidate to validate
   * @returns asserts that the candidate is a valid lending pool ID for the specific protocol
   */
  protected abstract _validateLendingPoolId(
    candidate: ILendingPoolIdData,
  ): asserts candidate is ILendingPoolIdData

  /**
   * @name validatePositionId
   * @description Validates that the candidate is a valid position ID for the specific protocol
   * @param candidate The candidate to validate
   * @returns asserts that the candidate is a valid position ID for the specific protocol
   */
  protected abstract _validatePositionId(
    candidate: IPositionIdData,
  ): asserts candidate is IPositionIdData

  /** LENDING POOLS */

  /**
   * @name getLendingPoolImpl
   * @description Gets the lending pool for the given pool ID
   * @param poolId The pool ID
   * @returns The lending pool for the specific protocol
   *
   * @remarks This method should be implemented by the protocol plugin as the external one is just a wrapper to
   * validate the input and call this one
   */
  protected abstract _getLendingPoolImpl(poolId: ILendingPoolIdData): Promise<ILendingPool>

  /** @see IProtocolPlugin.getLendingPool */
  getLendingPool(poolId: ILendingPoolId): Promise<ILendingPool> {
    this._validateLendingPoolId(poolId)
    return this._getLendingPoolImpl(poolId)
  }

  /** POSITIONS */

  /** @see IProtocolPlugin.getPosition */
  abstract getPosition(positionId: IPositionId): Promise<IPosition>

  /** IMPORT POSITION */

  /** @see IProtocolPlugin.getImportPositionTransaction */
  abstract getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>>

  /** ACTION BUILDERS */

  /** @see IProtocolPlugin.getActionBuilder */
  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.stepBuilders[step.type] as ActionBuilder<T>
  }

  /** HELPERS */

  /**
   * @name _getDeploymentKey
   * @description Gets the key to use for the deployment configuration
   * @param chainInfo The chain information
   * @returns The key to use for the deployment configuration
   */
  protected _getDeploymentKey(chainInfo: ChainInfo): string {
    return `${chainInfo.name}.${this.deploymentConfigTag}`
  }
}
