import { Position, ChainInfo, Maybe } from '@summerfi/sdk-common/common'
import { LendingPool, IPoolId } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'
import { IPositionId } from '../interfaces/IPositionId'
import { IProtocolPlugin } from '../interfaces/IProtocolPlugin'
import { IProtocolPluginContext } from '../interfaces/IProtocolPluginContext'
import { ActionBuilder, ActionBuildersMap } from '@summerfi/order-planner-common/builders'
import { steps } from '@summerfi/sdk-common/simulation'

/**
 * @class Base class for all ProtocolDataPlugins. It provides the basic functionality & fields for all protocol plugins
 *              and implements shared functionality for late dependency injection, pool schema validation
 *              and action building
 */
export abstract class BaseProtocolPlugin<PoolIdType extends IPoolId>
  implements IProtocolPlugin<PoolIdType>
{
  readonly protocol: PoolIdType['protocol']['name']
  readonly supportedChains: ChainInfo[]
  _ctx: IProtocolPluginContext | undefined
  readonly schema: z.ZodSchema<PoolIdType>
  readonly StepBuilders: Partial<ActionBuildersMap>

  protected constructor(
    protocol: PoolIdType['protocol']['name'],
    supportedChains: ChainInfo[],
    schema: z.ZodSchema<PoolIdType>,
    StepBuildersMap: Partial<ActionBuildersMap>,
  ) {
    this.protocol = protocol
    this.supportedChains = supportedChains
    this.schema = schema
    this.StepBuilders = StepBuildersMap
  }

  init(ctx: IProtocolPluginContext): void {
    this._ctx = ctx
  }

  get ctx(): IProtocolPluginContext {
    if (!this._ctx) {
      throw new Error('Context (ctx) is not initialized. Please call init() with a valid context.')
    }
    return this._ctx
  }

  // Protocol Data Methods
  abstract getPool(poolId: unknown): Promise<LendingPool>
  abstract getPosition(positionId: IPositionId): Promise<Position>

  isPoolId(candidate: unknown): asserts candidate is PoolIdType {
    const parseResult = this.schema.safeParse(candidate)
    if (!parseResult.success) {
      const errorDetails = parseResult.error.errors
        .map((error) => `${error.path.join('.')} - ${error.message}`)
        .join(', ')
      throw new Error(`Candidate is not correct: ${errorDetails}`)
    }
  }

  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.StepBuilders[step.type] as ActionBuilder<T>
  }
}
