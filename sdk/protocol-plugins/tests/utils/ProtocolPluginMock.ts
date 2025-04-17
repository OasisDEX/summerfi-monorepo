import {
  ActionBuilderParams,
  ActionBuilderUsedAction,
  ActionBuildersMap,
  FilterStep,
  IActionBuilder,
  IProtocolPlugin,
  IProtocolPluginContext,
} from '@summerfi/protocol-plugins-common'
import { ChainFamilyMap, IPoolId, Maybe, ProtocolName } from '@summerfi/sdk-common'
import { SimulationSteps, steps } from '@summerfi/sdk-common'

import { TransactionInfo } from '@summerfi/sdk-common'
import {
  ILendingPool,
  ILendingPoolId,
  ILendingPoolIdData,
  ILendingPoolInfo,
  ILendingPosition,
  ILendingPositionId,
} from '@summerfi/sdk-common'
import { IExternalLendingPosition, IPositionsManager } from '@summerfi/sdk-common'
import { IUser } from '@summerfi/sdk-common'
import { StepBuilderContextMock } from '@summerfi/testing-utils'
import { BaseActionBuilder } from '../../src'

/* eslint-disable @typescript-eslint/no-unused-vars */

export class PaybackWithdrawActionBuilderMock extends BaseActionBuilder<steps.PaybackWithdrawStep> {
  actions: ActionBuilderUsedAction[] = []
  async build(params: ActionBuilderParams<steps.PaybackWithdrawStep>): Promise<void> {
    ;(params.context as StepBuilderContextMock).setCheckpoint('PaybackWithdrawActionBuilderMock')
  }
}

export class DepositBorrowActionBuilderMock extends BaseActionBuilder<steps.DepositBorrowStep> {
  actions: ActionBuilderUsedAction[] = []
  async build(params: ActionBuilderParams<steps.DepositBorrowStep>): Promise<void> {
    ;(params.context as StepBuilderContextMock).setCheckpoint('DepositBorrowActionBuilderMock')
  }
}

export class ImportPositionActionBuilderMock extends BaseActionBuilder<steps.ImportStep> {
  actions: ActionBuilderUsedAction[] = []
  async build(params: ActionBuilderParams<steps.ImportStep>): Promise<void> {
    ;(params.context as StepBuilderContextMock).setCheckpoint('ImportPositionActionBuilderMock')
  }
}

export class OpenPositionActionBuilderMock extends BaseActionBuilder<steps.OpenPosition> {
  actions: ActionBuilderUsedAction[] = []
  async build(params: ActionBuilderParams<steps.OpenPosition>): Promise<void> {
    ;(params.context as StepBuilderContextMock).setCheckpoint('OpenPositionActionBuilderMock')
  }
}

export class PaybackWithdrawActionBuilderNoCheckpointMock extends BaseActionBuilder<steps.PaybackWithdrawStep> {
  actions: ActionBuilderUsedAction[] = []
  async build(params: ActionBuilderParams<steps.PaybackWithdrawStep>): Promise<void> {}
}

export class DepositBorrowActionBuilderNoCheckpointMock extends BaseActionBuilder<steps.DepositBorrowStep> {
  actions: ActionBuilderUsedAction[] = []
  async build(params: ActionBuilderParams<steps.DepositBorrowStep>): Promise<void> {}
}

export class ImportPositionActionBuilderNoCheckpointMock extends BaseActionBuilder<steps.ImportStep> {
  actions: ActionBuilderUsedAction[] = []
  async build(params: ActionBuilderParams<steps.ImportStep>): Promise<void> {}
}

export class OpenPositionActionBuilderNoCheckpointMock extends BaseActionBuilder<steps.OpenPosition> {
  actions: ActionBuilderUsedAction[] = []
  async build(params: ActionBuilderParams<steps.OpenPosition>): Promise<void> {}
}

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

  initialize(params: { context: IProtocolPluginContext }): void {
    this.context = params.context
  }

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

  async getLendingPosition(positionId: ILendingPositionId): Promise<ILendingPosition> {
    return undefined as unknown as ILendingPosition
  }

  getActionBuilder<
    StepType extends SimulationSteps,
    Step extends FilterStep<StepType, steps.Steps>,
  >(stepType: StepType): Maybe<IActionBuilder<Step>> {
    const builder = this.stepBuilders[stepType]

    if (!builder) {
      return undefined
    }

    return new builder()
  }

  async getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalLendingPosition
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

  initialize(params: { context: IProtocolPluginContext }): void {
    this.context = params.context
  }

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

  async getLendingPosition(positionId: ILendingPositionId): Promise<ILendingPosition> {
    return undefined as unknown as ILendingPosition
  }

  getActionBuilder<
    StepType extends SimulationSteps,
    Step extends FilterStep<StepType, steps.Steps>,
  >(stepType: StepType): Maybe<IActionBuilder<Step>> {
    const builder = this.stepBuilders[stepType]

    if (!builder) {
      return undefined
    }

    return new builder()
  }

  async getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalLendingPosition
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

  initialize(params: { context: IProtocolPluginContext }): void {
    this.context = params.context
  }

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

  async getLendingPosition(positionId: ILendingPositionId): Promise<ILendingPosition> {
    return undefined as unknown as ILendingPosition
  }

  getActionBuilder<
    StepType extends SimulationSteps,
    Step extends FilterStep<StepType, steps.Steps>,
  >(stepType: StepType): Maybe<IActionBuilder<Step>> {
    const builder = this.stepBuilders[stepType]

    if (!builder) {
      return undefined
    }

    return new builder()
  }

  async getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalLendingPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>> {
    return undefined as unknown as TransactionInfo
  }
}
