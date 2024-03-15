import { ActionBuilder, ActionBuildersMap } from '@summerfi/order-planner-common/builders'
import { IProtocolActionBuilder } from '@summerfi/order-planner-common/interfaces'
import { Maybe } from '@summerfi/sdk-common/common'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { OrderPlannerContextMock } from './OrderPlannerContextMock'

export const PaybackWithdrawActionBuilderMock: ActionBuilder<steps.PaybackWithdrawStep> = async (
  params,
): Promise<void> => {
  ;(params.context as OrderPlannerContextMock).setCheckpoint('PaybackWithdrawActionBuilderMock')
}

export const DepositBorrowActionBuilderMock: ActionBuilder<steps.DepositBorrowStep> = async (
  params,
): Promise<void> => {
  ;(params.context as OrderPlannerContextMock).setCheckpoint('DepositBorrowActionBuilderMock')
}

export class ProtocolBuilderMock implements IProtocolActionBuilder {
  readonly StepBuilders: Partial<ActionBuildersMap> = {
    [SimulationSteps.PaybackWithdraw]: PaybackWithdrawActionBuilderMock,
    [SimulationSteps.DepositBorrow]: DepositBorrowActionBuilderMock,
  }

  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.StepBuilders[step.type] as ActionBuilder<T>
  }
}

export class EmptyProtocolBuilderMock implements IProtocolActionBuilder {
  readonly StepBuilders: Partial<ActionBuildersMap> = {}

  getActionBuilder<T extends steps.Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this.StepBuilders[step.type] as ActionBuilder<T>
  }
}
