import {
  ActionBuilder,
  ActionBuildersMap,
  IPositionId,
  IProtocolPlugin,
  IProtocolPluginContext,
} from '@summerfi/protocol-plugins-common'
import { ChainInfo, Maybe, IPosition } from '@summerfi/sdk-common/common'
import { IExternalPosition, IPositionsManager, TransactionInfo } from '@summerfi/sdk-common/orders'
import { IPoolId, ProtocolName, IPool } from '@summerfi/sdk-common/protocols'
import { steps } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-common/user'
import { z } from 'zod'

/**
 * @class Base class for all ProtocolDataPlugins. It provides the basic functionality & fields for all protocol plugins
 *              and implements shared functionality for late dependency injection, pool schema validation
 *              and action building
 */
export abstract class BaseProtocolPlugin implements IProtocolPlugin {
  /** These properties need to be initialized by the actual plugin implementation */
  abstract readonly protocolName: ProtocolName
  // TODO: Use ContractProvider to determine supported chains
  abstract readonly supportedChains: ChainInfo[]
  abstract readonly stepBuilders: Partial<ActionBuildersMap>

  /** These properties are initialized in the constructor */
  readonly context: IProtocolPluginContext

  protected constructor(params: { context: IProtocolPluginContext }) {
    this.context = params.context
  }

  // Short alias for the context
  get ctx(): IProtocolPluginContext {
    return this.context
  }

  abstract isPoolId(candidate: unknown): candidate is IPoolId
  abstract validatePoolId(candidate: unknown): asserts candidate is IPoolId

  abstract getPool(poolId: unknown): Promise<IPool>
  abstract getPosition(positionId: IPositionId): Promise<IPosition>
  abstract getImportPositionTransaction(params: {
    user: IUser
    position: IExternalPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>>

  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.stepBuilders[step.type] as ActionBuilder<T>
  }

  protected _isPoolId<PoolId extends IPoolId>(
    candidate: unknown,
    schema: z.Schema,
  ): candidate is PoolId {
    const { success } = schema.safeParse(candidate)
    return success
  }
}
