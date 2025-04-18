import { steps } from '@summerfi/sdk-common'
import { isSparkLendingPool } from '../interfaces/ISparkLendingPool'
import { SparkSetEmodeAction } from '../actions/SparkSetEmodeAction'
import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class SparkOpenPositionActionBuilder extends BaseActionBuilder<steps.OpenPosition> {
  readonly actions: ActionBuilderUsedAction[] = [{ action: SparkSetEmodeAction }]

  async build(params: ActionBuilderParams<steps.OpenPosition>): Promise<void> {
    const { context, step } = params

    if (!isSparkLendingPool(step.inputs.pool)) {
      throw new Error('Invalid Spark lending pool')
    }

    const pool = step.inputs.pool

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
}
