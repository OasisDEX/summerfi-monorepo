/* eslint-disable @typescript-eslint/no-explicit-any */
import { Position } from '@summerfi/sdk-common/common'
import { IProtocolManagerContext } from '../interfaces/IProtocolManagerContext'
import { IProtocolDataPlugin } from '@summerfi/protocol-plugins'
// import { aaveV3Plugin } from './AAVEv3Plugin'
// import { makerPlugin } from './MakerPlugin'
import { IPoolId } from '@summerfi/sdk-common/protocols'
// import { sparkPlugin } from './SparkPlugin'
import { z } from 'zod'

type GetPoolIds<ProtocolPlugins extends IProtocolDataPlugin<any>[]> = {
  [K in keyof ProtocolPlugins]: ProtocolPlugins[K] extends IProtocolDataPlugin<infer T> ? T : never
}[number]
type UnPackPromise<T> = T extends Promise<infer U> ? U : T
type MatchProtocol<
  ProtocolPlugins extends IProtocolDataPlugin<any>[],
  PoolId extends IPoolId,
> = ProtocolPlugins extends [infer First, ...infer Rest]
  ? First extends IProtocolDataPlugin<PoolId>
    ? First
    : Rest extends IProtocolDataPlugin<any>[]
      ? MatchProtocol<Rest, PoolId>
      : never
  : never
type ReturnPool<
  ProtocolPlugins extends IProtocolDataPlugin<any>[],
  PoolId extends IPoolId,
> = UnPackPromise<ReturnType<MatchProtocol<ProtocolPlugins, PoolId>['getPool']>>
type ExtractPoolIds<P extends ProtocolManager<any>> =
  P extends ProtocolManager<infer T> ? GetPoolIds<T> : never

export class ProtocolManager<ProtocolPlugins extends IProtocolDataPlugin<any>[]> {
  private readonly plugins: ProtocolPlugins
  private ctx: IProtocolManagerContext | undefined
  constructor(plugins: ProtocolPlugins) {
    this.plugins = plugins;
  }

  public init(ctx: IProtocolManagerContext) {
    this.ctx = ctx;
  }

  public get poolIdSchema(): z.ZodSchema<ExtractPoolIds<typeof this>> {
    const allSchemas: z.ZodSchema<ExtractPoolIds<typeof this>>[] = this.plugins.map(
      (plugin) => plugin.schema,
    )

    return z.union(allSchemas as any as readonly [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]])
  }

  public async getPool<PoolId extends GetPoolIds<ProtocolPlugins>>(
    poolId: PoolId,
  ): Promise<ReturnPool<ProtocolPlugins, PoolId>> {
    if (!this.ctx) {
      throw new Error(`Context not initialised`)
    }

    const plugin: IProtocolDataPlugin<PoolId> | undefined = this.plugins.find(
      (plugin) => plugin.protocol === poolId.protocol.name,
    )

    if (!plugin) {
      throw new Error(`No plugin found for protocol: ${poolId.protocol.name}`)
    }
    const chainId = await this.ctx.provider.getChainId()

    if (!plugin.supportedChains.includes(chainId)) {
      throw new Error(`Chain ${chainId} is not supported by plugin ${plugin.protocol}`)
    }

    return (await plugin.getPool(poolId)) as ReturnPool<ProtocolPlugins, PoolId>
  }

  public getPosition(): Position {
    throw new Error('Not implemented')
  }
}

export const protocolManager = new ProtocolManager([
  makerPlugin,
  sparkPlugin,
  aaveV3Plugin,
] as const)

export type PoolIds = ExtractPoolIds<typeof protocolManager>
