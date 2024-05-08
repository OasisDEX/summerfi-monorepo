import { steps } from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'

import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { isSparkLendingPool } from '../interfaces'
import { SparkSetEmodeAction } from '../actions'

export const SparkOpenPositionList: ActionNames[] = ['SparkSetEMode']

export const SparkOpenPositionActionBuilder: ActionBuilder<steps.OpenPosition> = async (
  params,
): Promise<void> => {

  const { context, step } = params
  const pool = params.step.inputs.position.pool

  if (!isSparkLendingPool(pool)) {
    throw new Error('Only Spark lending pool is supported')
  }

  context.addActionCall({
    step: step,
    action: new SparkSetEmodeAction(),
    arguments: {
      emode: pool.id.emodeType,

    },
    connectedInputs: {},
    connectedOutputs: {},
  })
}
