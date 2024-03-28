import { ChainFamilyMap, IPosition, Maybe } from '@summerfi/sdk-common/common'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { StepBuilderContextMock } from '../../../testing-utils/src/mocks/StepBuilderContextMock'
import {
  ActionBuilder,
  ActionBuildersMap,
  IPositionId,
  IProtocolPlugin,
  IProtocolPluginContext,
} from '@summerfi/protocol-plugins-common'
import { IPool, IPoolId, ProtocolName } from '@summerfi/sdk-common/protocols'

/* eslint-disable @typescript-eslint/no-unused-vars */

export const PaybackWithdrawActionBuilderMock: ActionBuilder<steps.PaybackWithdrawStep> = async (
  params,
): Promise<void> => {
  ;(params.context as StepBuilderContextMock).setCheckpoint('PaybackWithdrawActionBuilderMock')
}

export const DepositBorrowActionBuilderMock: ActionBuilder<steps.DepositBorrowStep> = async (
  params,
): Promise<void> => {
  ;(params.context as StepBuilderContextMock).setCheckpoint('DepositBorrowActionBuilderMock')
}

export const PaybackWithdrawActionBuilderNoCheckpointMock: ActionBuilder<
  steps.PaybackWithdrawStep
> = async (params): Promise<void> => {}

export const DepositBorrowActionBuilderNoCheckpointMock: ActionBuilder<
  steps.DepositBorrowStep
> = async (params): Promise<void> => {}

export class ProtocolPluginMock implements IProtocolPlugin {
  protocolName = ProtocolName.Spark
  supportedChains = [ChainFamilyMap.Ethereum.Mainnet]
  stepBuilders: Partial<ActionBuildersMap> = {
    [SimulationSteps.PaybackWithdraw]: PaybackWithdrawActionBuilderMock,
    [SimulationSteps.DepositBorrow]: DepositBorrowActionBuilderMock,
  }
  context = undefined as unknown as IProtocolPluginContext

  isPoolId(candidate: unknown): candidate is IPoolId {
    return true
  }

  validatePoolId(candidate: unknown): asserts candidate is IPoolId {}

  async getPool(poolId: IPoolId): Promise<IPool> {
    return undefined as unknown as IPool
  }

  async getPosition(positionId: IPositionId): Promise<IPosition> {
    return undefined as unknown as IPosition
  }

  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.stepBuilders[step.type] as ActionBuilder<T>
  }
}

export class EmptyProtocolPluginMock implements IProtocolPlugin {
  protocolName = ProtocolName.Spark
  supportedChains = [ChainFamilyMap.Ethereum.Mainnet]
  stepBuilders: Partial<ActionBuildersMap> = {}
  context = undefined as unknown as IProtocolPluginContext

  isPoolId(candidate: unknown): candidate is IPoolId {
    return true
  }

  validatePoolId(candidate: unknown): asserts candidate is IPoolId {}

  async getPool(poolId: IPoolId): Promise<IPool> {
    return undefined as unknown as IPool
  }

  async getPosition(positionId: IPositionId): Promise<IPosition> {
    return undefined as unknown as IPosition
  }

  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.stepBuilders[step.type] as ActionBuilder<T>
  }
}

export class NoCheckpointProtocolPluginMock implements IProtocolPlugin {
  protocolName = ProtocolName.Spark
  supportedChains = [ChainFamilyMap.Ethereum.Mainnet]
  stepBuilders: Partial<ActionBuildersMap> = {
    [SimulationSteps.PaybackWithdraw]: PaybackWithdrawActionBuilderNoCheckpointMock,
    [SimulationSteps.DepositBorrow]: DepositBorrowActionBuilderNoCheckpointMock,
  }
  context = undefined as unknown as IProtocolPluginContext

  isPoolId(candidate: unknown): candidate is IPoolId {
    return true
  }

  validatePoolId(candidate: unknown): asserts candidate is IPoolId {}

  async getPool(poolId: IPoolId): Promise<IPool> {
    return undefined as unknown as IPool
  }

  async getPosition(positionId: IPositionId): Promise<IPosition> {
    return undefined as unknown as IPosition
  }

  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.stepBuilders[step.type] as ActionBuilder<T>
  }
}
