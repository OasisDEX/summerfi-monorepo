import { steps } from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'

import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { isAaveV3LendingPool } from '../interfaces'
import { AaveV3SetEmodeAction } from '../actions'

export const AaveV3OpenPositionList: ActionNames[] = ['AaveV3SetEMode']

export const AaveV3OpenPositionActionBuilder: ActionBuilder<steps.OpenPosition> = async (
  params,
): Promise<void> => {

  const { context, step } = params
  const pool = params.step.inputs.position.pool

  if (!isAaveV3LendingPool(pool)) {
    throw new Error('Only Aave lending pool is supported')
  }

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
