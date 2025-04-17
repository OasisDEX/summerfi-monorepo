import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'
import { FlashloanAction } from '../actions'

export class FlashloanActionBuilder extends BaseActionBuilder<steps.FlashloanStep> {
  /**
   * Special case for the declared actions: the flashloan action is indicated here although
   * it is not used in the builder. This is due to the Flashloan inverstion problem in which
   * the flashloan action is used when the RepayFlashloan step is built, but for the
   * strategy definition we need to have the action registered at this moment
   */
  readonly actions: ActionBuilderUsedAction[] = [{ action: FlashloanAction }]

  async build(params: ActionBuilderParams<steps.FlashloanStep>): Promise<void> {
    // Start a new calls level until the flashloan is finished
    params.context.startSubContext({
      customData: params.step.inputs,
    })
  }
}
