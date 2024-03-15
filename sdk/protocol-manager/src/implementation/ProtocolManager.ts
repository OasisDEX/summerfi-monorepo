import { Position } from "@summerfi/sdk-common/common";
import { ProtocolManagerContext, ProtocolPlugin } from "../interfaces/ProtocolPlugin";
import { aaveV3Plugin } from "./AAVEv3Plugin";
import { makerPlugin } from "./MakerPlugin";
import { IPoolId } from "@summerfi/sdk-common/protocols";
import { sparkPlugin } from "./SparkPlugin";
import { z } from "zod";

type GetPoolIds<ProtocolPlugins extends ProtocolPlugin<any>[]> = { [K in keyof ProtocolPlugins]: ProtocolPlugins[K] extends ProtocolPlugin<infer T> ? T : never }[number]
type UnPackPromise<T> = T extends Promise<infer U> ? U : T
type MatchProtocol<ProtocolPlugins extends ProtocolPlugin<any>[], PoolId extends IPoolId> = ProtocolPlugins extends [infer First, ...infer Rest] 
    ? First extends ProtocolPlugin<PoolId> 
        ? First 
        : Rest extends ProtocolPlugin<any>[] 
            ? MatchProtocol<Rest, PoolId> 
            : never
    : never
type ReturnPool<ProtocolPlugins extends ProtocolPlugin<any>[], PoolId extends IPoolId> = UnPackPromise<ReturnType<MatchProtocol<ProtocolPlugins, PoolId>['getPool']>>
type ExtractPoolIds<P extends ProtocolManager<any>> = P extends ProtocolManager<infer T> ? GetPoolIds<T> : never

export class ProtocolManager<ProtocolPlugins extends ProtocolPlugin<any>[]> {
    constructor(private readonly plugins: ProtocolPlugins) {}

    public get poolIdSchema(): z.ZodSchema<ExtractPoolIds<typeof this>> {
        const allSchemas: z.ZodSchema<ExtractPoolIds<typeof this>>[] = this.plugins.map((plugin) => plugin.schema)

        return z.union(allSchemas as any as readonly [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]])
    }

    public async getPool<PoolId extends  GetPoolIds<ProtocolPlugins>>(poolId: PoolId, ctx: ProtocolManagerContext): Promise<ReturnPool<ProtocolPlugins, PoolId>> {
        const plugin: ProtocolPlugin<PoolId> | undefined = this.plugins.find((plugin) => plugin.protocol === poolId.protocol.name)

        if (!plugin) {
            throw new Error(`No plugin found for protocol: ${poolId.protocol.name}`)
        }
        const chainId = await ctx.provider.getChainId()

        if (!plugin.supportedChains.includes(chainId)) {
            throw new Error(`Chain ${chainId} is not supported by plugin ${plugin.protocol}`)
        }

        return await plugin.getPool(poolId, ctx) as ReturnPool<ProtocolPlugins, PoolId>
    }

    public getPosition(ctx: ProtocolManagerContext): Position {
        throw new Error('Not implemented')
    }
}

export const protocolManager = new ProtocolManager([
    makerPlugin, 
    sparkPlugin,
    aaveV3Plugin,
] as const)

export type PoolIds = ExtractPoolIds<typeof protocolManager>

