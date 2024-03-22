import { ActionNames } from '@summerfi/deployment-types'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { steps } from '@summerfi/sdk-common/simulation'

export const FlashloanActionList: ActionNames[] = ['TakeFlashloan']

export const FlashloanActionBuilder: ActionBuilder<steps.FlashloanStep> = async (
  params,
): Promise<void> => {
  // Start a new calls level until the flashloan is finished
  params.context.startSubContext({
    customData: params.step.inputs,
  })
}
