import { ChainInfo, IPosition, Maybe } from '@summerfi/sdk-common/common'
import { IPoolId, IPool, ProtocolName } from '@summerfi/sdk-common/protocols'
import { type IProtocolPluginContext } from './IProtocolPluginContext'
import { IPositionId } from './IPositionId'
import { steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder, ActionBuildersMap } from '../types/StepBuilderTypes'
import { IUser } from '@summerfi/sdk-common/user'
import { IExternalPosition, IPositionsManager, TransactionInfo } from '@summerfi/sdk-common/orders'

export interface IProtocolPlugin {
  protocolName: ProtocolName
  supportedChains: ChainInfo[]
  stepBuilders: Partial<ActionBuildersMap>
  context: IProtocolPluginContext

  isPoolId(candidate: unknown): candidate is IPoolId
  validatePoolId(candidate: unknown): asserts candidate is IPoolId

  getPool: (poolId: IPoolId) => Promise<IPool>
  getPosition: (positionId: IPositionId) => Promise<IPosition>
  getActionBuilder<StepType extends steps.Steps>(step: StepType): Maybe<ActionBuilder<StepType>>
  getImportPositionTransaction: (params: {
    user: IUser
    position: IExternalPosition
    positionsManager: IPositionsManager
  }) => Promise<Maybe<TransactionInfo>>
}
