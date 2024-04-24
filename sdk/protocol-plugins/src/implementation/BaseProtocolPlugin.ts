import {
  ActionBuilder,
  ActionBuildersMap,
  IProtocolPlugin,
  IProtocolPluginContext,
} from '@summerfi/protocol-plugins-common'
import { ChainInfo, Maybe, IPosition, IPositionId } from '@summerfi/sdk-common/common'
import { IExternalPosition, IPositionsManager, TransactionInfo } from '@summerfi/sdk-common/orders'
import { IPoolId, ProtocolName, ILendingPool } from '@summerfi/sdk-common/protocols'
import { steps } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-common/user'

/**
 * @class BaseProtocolPlugin
 * @description Base class for all protocol plugins
 *
 * It provides some extra functionality to validate input data coming from the SDK client
 */
export abstract class BaseProtocolPlugin implements IProtocolPlugin {
  /** These properties need to be initialized by the actual plugin implementation */
  abstract readonly protocolName: ProtocolName
  // TODO: Use ContractProvider to determine supported chains
  abstract readonly supportedChains: ChainInfo[]
  abstract readonly stepBuilders: Partial<ActionBuildersMap>

  /** These properties are initialized in the constructor */
  readonly context: IProtocolPluginContext
  readonly deploymentConfigTag: string

  protected constructor(params: { context: IProtocolPluginContext; deploymentConfigTag?: string }) {
    this.context = params.context
    this.deploymentConfigTag = params.deploymentConfigTag ?? 'standard'
  }

  // Short alias for the context
  get ctx(): IProtocolPluginContext {
    return this.context
  }

  /** LENDING POOLS */

  /**
   * @name validateLendingPoolId
   * @description Validates that the candidate is a valid lending pool ID for the specific protocol
   * @param candidate The candidate to validate
   * @returns asserts that the candidate is a valid lending pool ID for the specific protocol
   */
  protected abstract validateLendingPoolId(candidate: unknown): asserts candidate is IPoolId

  /**
   * @name getLendingPoolImpl
   * @description Gets the lending pool for the given pool ID
   * @param poolId The pool ID
   * @returns The lending pool for the specific protocol
   *
   * @remarks This method should be implemented by the protocol plugin as the external one is just a wrapper to
   * validate the input and call this one
   */
  protected abstract _getLendingPoolImpl(poolId: IPoolId): Promise<ILendingPool>

  /** @see IProtocolPlugin.getLendingPool */
  getLendingPool(poolId: unknown): Promise<ILendingPool> {
    this.validateLendingPoolId(poolId)
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
