import { steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { isMorphoLendingPool } from '../interfaces/IMorphoLendingPool'

export const MorphoOpenPositionActionBuilder: ActionBuilder<steps.OpenPosition> = async (
  params,
): Promise<void> => {
  const { step } = params

  if (!isMorphoLendingPool(step.inputs.pool)) {
    throw new Error('Invalid Morpho lending pool id')
  }

  // No-op for Morpho
}
