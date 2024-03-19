import {ChainId, Position, ChainInfo} from "@summerfi/sdk-common/common";
import {LendingPool} from "@summerfi/sdk-common/protocols";
import {z} from "zod";
import {IPositionId} from "../interfaces/IPositionId";
import {IProtocolPlugin} from "../interfaces/IProtocolPlugin";
import {IProtocolPluginContext} from "../interfaces/IProtocolPluginContext";
import {IPoolId} from '@summerfi/sdk-common/protocols'
import { ActionBuilder, ActionBuildersMap } from '@summerfi/order-planner-common/builders'
import { steps } from '@summerfi/sdk-common/simulation'
import { Maybe } from '@summerfi/sdk-common/common'

/**
 * @class Base class for all ProtocolDataPlugins. It provides the basic functionality & fields for all protocol plugins
 *              and implements shared functionality for late dependency injection, pool schema validation
 *              and action building
 */
export abstract class BaseProtocolPlugin<PoolIdType extends IPoolId = IPoolId, LendingPoolType extends LendingPool = LendingPool> implements IProtocolPlugin<PoolIdType> {
    public readonly protocol: PoolIdType['protocol']['name']
    public readonly supportedChains: ChainInfo[]
    public _ctx: IProtocolPluginContext | undefined
    public readonly schema: z.ZodSchema<PoolIdType>
    public readonly StepBuilders: Partial<ActionBuildersMap>

    protected constructor(protocol: PoolIdType['protocol']['name'], supportedChains: ChainInfo[], schema: z.ZodSchema<PoolIdType>, StepBuildersMap: Partial<ActionBuildersMap>) {
        this.protocol = protocol
        this.supportedChains = supportedChains
        this.schema = schema
        this.StepBuilders = StepBuildersMap
    }

    init(ctx: IProtocolPluginContext): void  {
        this._ctx = ctx;
    }

    public get ctx(): IProtocolPluginContext {
        if (!this._ctx) {
            throw new Error('Context (ctx) is not initialized. Please call init() with a valid context.');
        }
        return this._ctx;
    }

    // Protocol Data Methods
    public abstract getPool(poolId: unknown): Promise<LendingPoolType>
    public abstract getPositionId(positionId: IPositionId): string
    public abstract getPosition(positionId: IPositionId): Promise<Position>

    isPoolId(candidate: unknown): asserts candidate is PoolIdType {
        const parseResult = this.schema.safeParse(candidate)
        if (!parseResult.success) {
            const errorDetails = parseResult.error.errors
                .map((error) => `${error.path.join('.')} - ${error.message}`)
                .join(', ')
            throw new Error(`Candidate is not correct: ${errorDetails}`)
        }
    }

    // Action Builder method
    getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
        return this.StepBuilders[step.type] as ActionBuilder<T>
    }}
