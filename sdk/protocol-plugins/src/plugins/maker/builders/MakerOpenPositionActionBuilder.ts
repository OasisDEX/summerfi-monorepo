import { steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { isMakerLendingPool } from '../interfaces/IMakerLendingPool'

export const MakerOpenPositionActionBuilder: ActionBuilder<steps.OpenPosition> = async (
  params,
): Promise<void> => {
  const { step } = params

  if (!isMakerLendingPool(step.inputs.pool)) {
    throw new Error('Invalid Maker lending pool id')
  }

  // No-op for Maker
}
