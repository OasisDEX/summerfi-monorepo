import { steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { isAaveV3LendingPool } from '../interfaces'
import { AaveV3SetEmodeAction } from '../actions/AaveV3SetEmodeAction'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class AaveV3OpenPositionActionBuilder extends BaseActionBuilder<steps.OpenPosition> {
  async build(params: ActionBuilderParams<steps.OpenPosition>): Promise<void> {
    const { context, step } = params

    if (!isAaveV3LendingPool(step.inputs.pool)) {
      throw new Error('Invalid AaveV3 lending pool')
    }

    const pool = step.inputs.pool

    context.addActionCall({
      step: step,
      action: new AaveV3SetEmodeAction(),
      arguments: {
        emode: pool.id.emodeType,
      },
      connectedInputs: {},
      connectedOutputs: {},
    })
  }
}
