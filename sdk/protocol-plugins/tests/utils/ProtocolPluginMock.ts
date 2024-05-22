import { ChainFamilyMap, IPosition, IPositionId, Maybe } from '@summerfi/sdk-common/common'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import {
  ActionBuilder,
  ActionBuildersMap,
  IProtocolPlugin,
  IProtocolPluginContext,
} from '@summerfi/protocol-plugins-common'
import {
  ILendingPool,
  ILendingPoolId,
  ILendingPoolIdData,
  ILendingPoolInfo,
  IPool,
  IPoolId,
  ProtocolName,
} from '@summerfi/sdk-common/protocols'
import { IExternalPosition, IPositionsManager } from '@summerfi/sdk-common/orders'
import { IUser } from '@summerfi/sdk-common/user'
import { TransactionInfo } from '@summerfi/sdk-common'
import { StepBuilderContextMock } from '@summerfi/testing-utils'

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

export const ImportPositionActionBuilderMock: ActionBuilder<steps.ImportStep> = async (
  params,
): Promise<void> => {
  ;(params.context as StepBuilderContextMock).setCheckpoint('ImportPositionActionBuilderMock')
}

export const OpenPositionActionBuilderMock: ActionBuilder<steps.OpenPosition> = async (
  params,
): Promise<void> => {
  ;(params.context as StepBuilderContextMock).setCheckpoint('OpenPositionActionBuilderMock')
}

export const PaybackWithdrawActionBuilderNoCheckpointMock: ActionBuilder<
  steps.PaybackWithdrawStep
> = async (params): Promise<void> => {}

export const DepositBorrowActionBuilderNoCheckpointMock: ActionBuilder<
  steps.DepositBorrowStep
> = async (params): Promise<void> => {}

export const ImportPositionActionBuilderNoCheckpointMock: ActionBuilder<steps.ImportStep> = async (
  params,
): Promise<void> => {}

export const OpenPositionActionBuilderNoCheckpointMock: ActionBuilder<steps.OpenPosition> = async (
  params,
): Promise<void> => {}

export class ProtocolPluginMock implements IProtocolPlugin {
  protocolName = ProtocolName.Spark
  supportedChains = [ChainFamilyMap.Ethereum.Mainnet]
  stepBuilders: Partial<ActionBuildersMap> = {
    [SimulationSteps.PaybackWithdraw]: PaybackWithdrawActionBuilderMock,
    [SimulationSteps.DepositBorrow]: DepositBorrowActionBuilderMock,
    [SimulationSteps.Import]: ImportPositionActionBuilderMock,
    [SimulationSteps.OpenPosition]: OpenPositionActionBuilderMock,
  }
  context = undefined as unknown as IProtocolPluginContext

  isLendingPoolId(candidate: unknown): candidate is IPoolId {
    return true
  }

  validateLendingPoolId(candidate: unknown): asserts candidate is IPoolId {}

  async getLendingPool(poolId: ILendingPoolId): Promise<ILendingPool> {
    return undefined as unknown as ILendingPool
  }

  async getLendingPoolInfo(poolId: ILendingPoolIdData): Promise<ILendingPoolInfo> {
    return undefined as unknown as ILendingPoolInfo
  }

  async getPosition(positionId: IPositionId): Promise<IPosition> {
    return undefined as unknown as IPosition
  }

  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.stepBuilders[step.type] as ActionBuilder<T>
  }

  async getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>> {
    return {} as unknown as TransactionInfo
  }
}

export class EmptyProtocolPluginMock implements IProtocolPlugin {
  protocolName = ProtocolName.Spark
  supportedChains = [ChainFamilyMap.Ethereum.Mainnet]
  stepBuilders: Partial<ActionBuildersMap> = {}
  context = undefined as unknown as IProtocolPluginContext

  isLendingPoolId(candidate: unknown): candidate is IPoolId {
    return true
  }

  validateLendingPoolId(candidate: unknown): asserts candidate is IPoolId {}

  async getLendingPool(poolId: ILendingPoolId): Promise<ILendingPool> {
    return undefined as unknown as ILendingPool
  }

  async getLendingPoolInfo(poolId: ILendingPoolIdData): Promise<ILendingPoolInfo> {
    return undefined as unknown as ILendingPoolInfo
  }

  async getPosition(positionId: IPositionId): Promise<IPosition> {
    return undefined as unknown as IPosition
  }

  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.stepBuilders[step.type] as ActionBuilder<T>
  }

  async getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>> {
    return undefined as unknown as TransactionInfo
  }
}

export class NoCheckpointProtocolPluginMock implements IProtocolPlugin {
  protocolName = ProtocolName.Spark
  supportedChains = [ChainFamilyMap.Ethereum.Mainnet]
  stepBuilders: Partial<ActionBuildersMap> = {
    [SimulationSteps.PaybackWithdraw]: PaybackWithdrawActionBuilderNoCheckpointMock,
    [SimulationSteps.DepositBorrow]: DepositBorrowActionBuilderNoCheckpointMock,
    [SimulationSteps.Import]: ImportPositionActionBuilderNoCheckpointMock,
    [SimulationSteps.OpenPosition]: OpenPositionActionBuilderNoCheckpointMock,
  }
  context = undefined as unknown as IProtocolPluginContext

  isLendingPoolId(candidate: unknown): candidate is IPoolId {
    return true
  }

  validateLendingPoolId(candidate: unknown): asserts candidate is IPoolId {}

  async getLendingPool(poolId: ILendingPoolId): Promise<ILendingPool> {
    return undefined as unknown as ILendingPool
  }

  async getLendingPoolInfo(poolId: ILendingPoolIdData): Promise<ILendingPoolInfo> {
    return undefined as unknown as ILendingPoolInfo
  }

  async getPosition(positionId: IPositionId): Promise<IPosition> {
    return undefined as unknown as IPosition
  }

  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.stepBuilders[step.type] as ActionBuilder<T>
  }

  async getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>> {
    return undefined as unknown as TransactionInfo
  }
}
