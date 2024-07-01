import { ActionBuildersMap } from '@summerfi/protocol-plugins-common'
import { MorphoBlueDepositBorrowActionBuilder } from './MorphoBlueDepositBorrowActionBuilder'
import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { MorphoBluePaybackWithdrawActionBuilder } from './MorphoBluePaybackWithdrawActionBuilder'
import { MorphoBlueOpenPositionActionBuilder } from './MorphoBlueOpenPositionActionBuilder'

export const MorphoBlueStepBuilders: Partial<ActionBuildersMap> = {
  [SimulationSteps.DepositBorrow]: MorphoBlueDepositBorrowActionBuilder,
  [SimulationSteps.PaybackWithdraw]: MorphoBluePaybackWithdrawActionBuilder,
  [SimulationSteps.OpenPosition]: MorphoBlueOpenPositionActionBuilder,
}
