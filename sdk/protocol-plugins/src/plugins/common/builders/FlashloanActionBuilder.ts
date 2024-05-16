import { ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common/simulation'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class FlashloanActionBuilder extends BaseActionBuilder<steps.FlashloanStep> {
  async build(params: ActionBuilderParams<steps.FlashloanStep>): Promise<void> {
    // Start a new calls level until the flashloan is finished
    params.context.startSubContext({
      customData: params.step.inputs,
    })
  }
}
