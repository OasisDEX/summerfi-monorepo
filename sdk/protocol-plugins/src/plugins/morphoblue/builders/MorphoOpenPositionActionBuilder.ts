import { steps } from '@summerfi/sdk-common'
import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { isMorphoLendingPool } from '../interfaces/IMorphoLendingPool'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class MorphoOpenPositionActionBuilder extends BaseActionBuilder<steps.OpenPosition> {
  readonly actions: ActionBuilderUsedAction[] = [
    // Empty on purpose, no definition needs to be generated for this builder
  ]

  async build(params: ActionBuilderParams<steps.OpenPosition>): Promise<void> {
    const { step } = params

    if (!isMorphoLendingPool(step.inputs.pool)) {
      throw new Error('Invalid Morpho lending pool id')
    }

    // No-op for Morpho
  }
}
