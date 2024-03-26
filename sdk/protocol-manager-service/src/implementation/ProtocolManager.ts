/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChainId, IPosition } from '@summerfi/sdk-common/common'
import { IProtocolManager } from '@summerfi/protocol-manager-common'
import { z } from 'zod'
import { IPool, IPoolId, ProtocolName } from '@summerfi/sdk-common/protocols'
import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'

export class ProtocolManager implements IProtocolManager {
  private pluginsRegistry: IProtocolPluginsRegistry

  private PoolIdSchema = z.object({
    protocol: z.object({
      name: z.nativeEnum(ProtocolName),
      chainInfo: z.object({
        name: z.string(),
        chainId: z.custom<ChainId>(),
      }),
    }),
  })

  constructor(params: { pluginsRegistry: IProtocolPluginsRegistry }) {
    this.pluginsRegistry = params.pluginsRegistry
  }

  public async getPool(poolId: unknown): Promise<IPool> {
    this.validatePoolId(poolId)

    const plugin = this.pluginsRegistry.getPlugin({ protocolName: poolId.protocol.name })
    if (!plugin) {
      throw new Error(`Protocol plugin for protocol ${poolId.protocol.name} not found`)
    }
    return plugin.getPool(poolId)
  }

  getPosition(): IPosition {
    throw new Error('Not implemented')
  }

  private isPoolId(candidate: unknown): candidate is IPoolId {
    const { success } = this.PoolIdSchema.safeParse(candidate)
    return success
  }

  private validatePoolId(candidate: unknown): asserts candidate is IPoolId {
    if (!this.isPoolId(candidate)) {
      throw new Error(`Invalid pool ID: ${JSON.stringify(candidate)}`)
    }
  }
}
