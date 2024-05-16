import {
  ActionBuildersMap,
  IActionBuilder,
  IProtocolPlugin,
  IProtocolPluginContext,
} from '@summerfi/protocol-plugins-common'
import {
  ChainInfo,
  Maybe,
  IPosition,
  IPositionIdData,
  IAddress,
  IChainInfo,
} from '@summerfi/sdk-common/common'
import { IExternalPosition, IPositionsManager, TransactionInfo } from '@summerfi/sdk-common/orders'
import {
  ProtocolName,
  ILendingPool,
  ILendingPoolIdData,
  ILendingPoolInfo,
} from '@summerfi/sdk-common/protocols'
import { steps } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-common/user'
import { getContractAddress } from '../plugins/utils/GetContractAddress'

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

  protected constructor(params: { context: IProtocolPluginContext }) {
    this.context = params.context

    if (!this.context.provider.chain) {
      throw new Error('ctx.provider.chain undefined')
    }

    if (!this.context.provider.chain.id) {
      throw new Error('ctx.provider.chain.id undefined')
    }
  }

  // Short alias for the context
  protected get ctx(): IProtocolPluginContext {
    return this.context
  }

  /** VALIDATORS */

  /**
   * @name _validateLendingPoolId
   * @description Validates that the candidate is a valid lending pool ID for the specific protocol
   * @param candidate The candidate to validate
   * @returns asserts that the candidate is a valid lending pool ID for the specific protocol
   */
  protected abstract _validateLendingPoolId(
    candidate: ILendingPoolIdData,
  ): asserts candidate is ILendingPoolIdData

  /**
   * @name _validatePositionId
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

  /**
   * @name getLendingPoolInfoImpl
   * @description Gets the lending pool info for the given pool ID
   * @param poolId The pool ID
   * @returns The lending pool info for the specific protocol
   *
   * @remarks This method should be implemented by the protocol plugin as the external one is just a wrapper to
   * validate the input and call this one
   */
  protected abstract _getLendingPoolInfoImpl(poolId: ILendingPoolIdData): Promise<ILendingPoolInfo>

  /** @see IProtocolPlugin.getLendingPool */
  async getLendingPool(poolId: ILendingPoolIdData): Promise<ILendingPool> {
    this._validateLendingPoolId(poolId)
    this._checkChainIdSupported(poolId.protocol.chainInfo.chainId)

    return this._getLendingPoolImpl(poolId)
  }

  /** @see IProtocolPlugin.getLendingPoolInfo */
  async getLendingPoolInfo(poolId: ILendingPoolIdData): Promise<ILendingPoolInfo> {
    this._validateLendingPoolId(poolId)
    this._checkChainIdSupported(poolId.protocol.chainInfo.chainId)

    return this._getLendingPoolInfoImpl(poolId)
  }

  /** POSITIONS */

  /** @see IProtocolPlugin.getPosition */
  abstract getPosition(positionId: IPositionIdData): Promise<IPosition>

  /** IMPORT POSITION */

  /** @see IProtocolPlugin.getImportPositionTransaction */
  abstract getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>>

  /** ACTION BUILDERS */

  /** @see IProtocolPlugin.getActionBuilder */
  getActionBuilder<StepType extends steps.Steps>(step: StepType): Maybe<IActionBuilder<StepType>> {
    const builder = this.stepBuilders[step.type]

    if (!builder) {
      return undefined
    }

    return new builder() as IActionBuilder<StepType>
  }

  /** HELPERS */

  /**
   * Retrieves the contract address for a given chain
   * @param chainInfo The chain where the contract is deployed
   * @param contractName THe name of the contract
   * @returns The address of the contract or throws if not found
   */
  protected async _getContractAddress(params: {
    chainInfo: IChainInfo
    contractName: string
  }): Promise<IAddress> {
    return getContractAddress({
      addressBookManager: this.context.addressBookManager,
      chainInfo: params.chainInfo,
      contractName: params.contractName,
    })
  }

  /** PRIVATE */

  /**
   * @name _validateChainId
   * @param chainId  The chain ID to validate
   * @returns asserts that the chain ID is supported
   */
  private _checkChainIdSupported(chainId: number) {
    if (!this.supportedChains.some((chain) => chain.chainId === chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported`)
    }
  }
}
