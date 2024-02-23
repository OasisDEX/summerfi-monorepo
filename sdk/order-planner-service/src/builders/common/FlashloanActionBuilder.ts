import { ActionNames } from '@summerfi/deployment-types'
import { FlashloanStep } from '@summerfi/sdk-common/orders'

import { ActionBuilder } from '~orderplanner/builders'

export const FlashloanActionList: ActionNames[] = ['TakeFlashloan']

export const FlashloanActionBuilder: ActionBuilder<FlashloanStep> = (params): void => {
  // Start a new calls level until the flashloan is finished
  params.context.startSubContext({
    customData: params.step.inputs,
  })
}
