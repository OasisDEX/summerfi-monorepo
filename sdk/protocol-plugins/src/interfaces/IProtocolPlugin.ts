import { IProtocolActionBuilder } from '@summerfi/order-planner-common/interfaces'
import { Position, ChainInfo } from '@summerfi/sdk-common/common'
import { LendingPool, IPoolId } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'
import { IProtocolPluginContext } from './IProtocolPluginContext'
import { IPositionId } from '../interfaces/IPositionId'

export interface IProtocolPlugin<PoolIdType extends IPoolId = IPoolId>
  extends IProtocolActionBuilder {
  protocol: PoolIdType['protocol']['name']
  supportedChains: ChainInfo[]
  schema: z.ZodSchema<PoolIdType>
  getPool: (poolId: unknown) => Promise<LendingPool>
  getPositionId: (positionId: IPositionId) => string
  getPosition: (positionId: IPositionId) => Promise<Position>
  isPoolId: (candidate: unknown) => asserts candidate is PoolIdType
  init: (ctx: IProtocolPluginContext) => void
}
