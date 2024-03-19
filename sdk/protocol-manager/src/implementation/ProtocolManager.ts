/* eslint-disable @typescript-eslint/no-explicit-any */
import { Position } from '@summerfi/sdk-common/common'
import { IProtocolManagerContext } from '../interfaces/IProtocolManagerContext'
import {
  BaseProtocolPlugin,
  aaveV3ProtocolPlugin,
  makerProtocolPlugin,
  sparkProtocolPlugin
} from '@summerfi/protocol-plugins'
import { IPoolId } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

type GetPoolIds<ProtocolPlugins extends BaseProtocolPlugin<any>[]> = {
  [K in keyof ProtocolPlugins]: ProtocolPlugins[K] extends BaseProtocolPlugin<infer T> ? T : never
}[number]
type UnPackPromise<T> = T extends Promise<infer U> ? U : T
type MatchProtocol<
    ProtocolPlugins extends BaseProtocolPlugin<any>[],
    PoolId extends IPoolId,
> = ProtocolPlugins extends [infer First, ...infer Rest]
    ? First extends BaseProtocolPlugin<PoolId>
        ? First
        : Rest extends BaseProtocolPlugin<any>[]
            ? MatchProtocol<Rest, PoolId>
            : never
    : never
type ReturnPool<
    ProtocolPlugins extends BaseProtocolPlugin<any>[],
    PoolId extends IPoolId,
> = UnPackPromise<ReturnType<MatchProtocol<ProtocolPlugins, PoolId>['getPool']>>
type ExtractPoolIds<P extends ProtocolManager<any>> =
    P extends ProtocolManager<infer T> ? GetPoolIds<T> : never

export class ProtocolManager<ProtocolPlugins extends BaseProtocolPlugin<any>[]> {
  private plugins: ProtocolPlugins
  private _ctx: IProtocolManagerContext | undefined

  constructor(plugins: ProtocolPlugins) {
    this.plugins = plugins;
  }

  init(ctx: IProtocolManagerContext): void {
    this._ctx = ctx
    this.plugins.forEach(p => {
        p.init(ctx);
    });
  }

  public get ctx(): IProtocolManagerContext {
    if (!this._ctx) {
      throw new Error('Context (ctx) is not initialized. Please call init() with a valid context.');
    }
    return this._ctx;
  }

  public get poolIdSchema(): z.ZodSchema<ExtractPoolIds<typeof this>> {
    const allSchemas: z.ZodSchema<ExtractPoolIds<typeof this>>[] = this.plugins.map(
      (plugin) => plugin.schema,
    )

    return z.union(allSchemas as any as readonly [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]])
  }

  public async getPool<PoolId extends GetPoolIds<ProtocolPlugins>>(
    poolId: IPoolId,
  ): Promise<ReturnPool<ProtocolPlugins, PoolId>> {
    const plugin: BaseProtocolPlugin<PoolId> | undefined = this.plugins.find(
      (plugin) => plugin.protocol === poolId.protocol.name,
    )

    if (!plugin) {
      throw new Error(`No plugin found for protocol: ${poolId.protocol.name}`)
    }
    const chainId = await this.ctx.provider.getChainId()

    if (!plugin.supportedChains.some(chainInfo => chainInfo.chainId === chainId)) {
      throw new Error(`Chain ${chainId} is not supported by plugin ${plugin.protocol}`)
    }

    return (await plugin.getPool(poolId)) as ReturnPool<ProtocolPlugins, PoolId>
  }

  public getPosition(): Position {
    throw new Error('Not implemented')
  }
}

export const protocolManager = new ProtocolManager([
  makerProtocolPlugin,
  sparkProtocolPlugin,
  aaveV3ProtocolPlugin,
] as const)


