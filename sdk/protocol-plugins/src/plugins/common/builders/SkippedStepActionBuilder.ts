import {
  ActionBuilderParams,
  ActionBuilderUsedAction,
  ActionConfig,
  BaseAction,
} from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

// TODO: temporary solution until we remove the Operations Registry
export class SkippedStepActionBuilder extends BaseActionBuilder<steps.SkippedStep> {
  readonly actions: ActionBuilderUsedAction[] = []

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  async build(params: ActionBuilderParams<steps.SkippedStep>): Promise<void> {
    const { context } = params
    const BuilderClass = params.actionBuildersMap[params.step.inputs.type]
    if (!BuilderClass) {
      return
    }

    const builder = new BuilderClass()

    for (const actionConfig of builder.actions) {
      if (actionConfig.action === 'DelegatedToProtocol') {
        throw new Error('DelegatedToProtocol is not supported in SkippedStepActionBuilder')
      }

      const action = new actionConfig.action()

      context.addActionCall({
        step: params.step,
        action: action as BaseAction<ActionConfig>,
        arguments: {},
        connectedInputs: {},
        connectedOutputs: {},
        skip: true,
      })
    }
  }
}
