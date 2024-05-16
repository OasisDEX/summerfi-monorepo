import { steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { isMorphoLendingPool } from '../interfaces/IMorphoLendingPool'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class MorphoOpenPositionActionBuilder extends BaseActionBuilder<steps.OpenPosition> {
  async build(params: ActionBuilderParams<steps.OpenPosition>): Promise<void> {
    const { step } = params

    if (!isMorphoLendingPool(step.inputs.pool)) {
      throw new Error('Invalid Morpho lending pool id')
    }

    // No-op for Morpho
  }
}
