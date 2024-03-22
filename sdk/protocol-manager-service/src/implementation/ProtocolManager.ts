/* eslint-disable @typescript-eslint/no-explicit-any */
import { Position } from '@summerfi/sdk-common/common'
import {
  BaseProtocolPlugin,
  aaveV3ProtocolPlugin,
  makerProtocolPlugin,
  sparkProtocolPlugin,
} from '@summerfi/protocol-plugins'
import {
  GetPoolIds,
  IProtocolManager,
  IProtocolManagerContext,
  ReturnPool,
} from '@summerfi/protocol-manager-common'
import { z } from 'zod'

type ExtractPoolIds<P extends ProtocolManager<any>> =
  P extends ProtocolManager<infer T> ? GetPoolIds<T> : never

export class ProtocolManager<ProtocolPlugins extends BaseProtocolPlugin<any>[]>
  implements IProtocolManager<ProtocolPlugins>
{
  private plugins: ProtocolPlugins
  private _ctx: IProtocolManagerContext | undefined

  constructor(plugins: ProtocolPlugins) {
    this.plugins = plugins
  }

  init(ctx: IProtocolManagerContext): void {
    this._ctx = ctx
    this.plugins.forEach((p) => {
      p.init(ctx)
    })
  }

  public get ctx(): IProtocolManagerContext {
    if (!this._ctx) {
      throw new Error('Context (ctx) is not initialized. Please call init() with a valid context.')
    }
    return this._ctx
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
    const plugin: BaseProtocolPlugin<PoolId> | undefined = this.plugins.find(
      (plugin) => plugin.protocol === poolId.protocol.name,
    )

    if (!plugin) {
      throw new Error(`No plugin found for protocol: ${poolId.protocol.name}`)
    }
    const chainId = await this.ctx.provider.getChainId()

    if (!plugin.supportedChains.some((chainInfo) => chainInfo.chainId === chainId)) {
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

export type PoolIds = ExtractPoolIds<typeof protocolManager>
