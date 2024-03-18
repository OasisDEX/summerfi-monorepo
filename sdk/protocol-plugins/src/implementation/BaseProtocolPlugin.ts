import {ChainId, Position} from "@summerfi/sdk-common/common";
import {LendingPool, ProtocolName} from "@summerfi/sdk-common/protocols";
import {z} from "zod";
import {IPositionId} from "../interfaces/IPositionId";
import {IProtocolPlugin} from "../interfaces/IProtocolPlugin";
import {IProtocolPluginContext} from "../interfaces/IProtocolPluginContext";
import {IPoolId} from '@summerfi/sdk-common/protocols'
import { ActionBuilder, ActionBuildersMap } from '@summerfi/order-planner-common/builders'
import { steps } from '@summerfi/sdk-common/simulation'
import { Maybe } from '@summerfi/sdk-common/common'

/**
 * @class Base class for all ProtocolDataPlugins. It provides the basic functionality to encode the call to the action and provide
 *              the versioned name of the action.
 */
export abstract class BaseProtocolPlugin<LendingPoolType extends LendingPool = LendingPool, PoolIdType extends IPoolId = IPoolId> implements IProtocolPlugin<PoolIdType> {
    public readonly protocol: PoolIdType['protocol']['name']
    public readonly supportedChains: ChainId[]
    public _ctx: IProtocolPluginContext | undefined
    public readonly schema: z.ZodSchema<PoolIdType>
    public readonly StepBuilders: Partial<ActionBuildersMap>

    protected constructor(protocol: PoolIdType['protocol']['name'], supportedChains: ChainId[], schema: z.ZodSchema<PoolIdType>, StepBuildersMap: Partial<ActionBuildersMap>) {
        this.protocol = protocol
        this.supportedChains = supportedChains
        this.schema = schema
        this.StepBuilders = StepBuildersMap
    }

    init(ctx: IProtocolPluginContext): BaseProtocolPlugin<LendingPoolType, PoolIdType>  {
        this._ctx = ctx;
        return this;
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
