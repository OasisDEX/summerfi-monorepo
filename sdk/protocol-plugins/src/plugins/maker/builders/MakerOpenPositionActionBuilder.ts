import { steps } from '@summerfi/sdk-common'
import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { isMakerLendingPool } from '../interfaces/IMakerLendingPool'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class MakerOpenPositionActionBuilder extends BaseActionBuilder<steps.OpenPosition> {
  readonly actions: ActionBuilderUsedAction[] = [
    // Empty on purpose, no definition needs to be generated for this builder
  ]

  async build(params: ActionBuilderParams<steps.OpenPosition>): Promise<void> {
    const { step } = params

    if (!isMakerLendingPool(step.inputs.pool)) {
      throw new Error('Invalid Maker lending pool id')
    }

    // No-op for Maker
  }
}
