/* eslint-disable @typescript-eslint/no-explicit-any */
import {BaseProtocolPlugin} from "@summerfi/protocol-plugins";
import {IProtocolManagerContext} from "./IProtocolManagerContext";
import { IPoolId } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

export type GetPoolIds<ProtocolPlugins extends BaseProtocolPlugin<any>[]> = {
    [K in keyof ProtocolPlugins]: ProtocolPlugins[K] extends BaseProtocolPlugin<infer T> ? T : never
}[number]
type UnPackPromise<T> = T extends Promise<infer U> ? U : T
export type MatchProtocol<
    ProtocolPlugins extends BaseProtocolPlugin<any>[],
    PoolId extends IPoolId,
> = ProtocolPlugins extends [infer First, ...infer Rest]
    ? First extends BaseProtocolPlugin<PoolId>
        ? First
        : Rest extends BaseProtocolPlugin<any>[]
            ? MatchProtocol<Rest, PoolId>
            : never
    : never
export type ReturnPool<
    ProtocolPlugins extends BaseProtocolPlugin<any>[],
    PoolId extends IPoolId,
> = UnPackPromise<ReturnType<MatchProtocol<ProtocolPlugins, PoolId>['getPool']>>

export interface IProtocolManager<ProtocolPlugins extends BaseProtocolPlugin<any>[]> {
    ctx: IProtocolManagerContext
    poolIdSchema: z.ZodSchema
    init: (ctx: IProtocolManagerContext) => void
    getPool: <PoolId extends GetPoolIds<ProtocolPlugins>>(poolId: PoolId) => Promise<ReturnPool<ProtocolPlugins, PoolId>>
    getPosition: () => void
}