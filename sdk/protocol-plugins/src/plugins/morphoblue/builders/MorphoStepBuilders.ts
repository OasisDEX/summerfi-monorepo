import { ActionBuildersMap } from '@summerfi/protocol-plugins-common'
import { MorphoDepositBorrowActionBuilder } from './MorphoDepositBorrowActionBuilder'
import { SimulationSteps } from '@summerfi/sdk-common'
import { MorphoPaybackWithdrawActionBuilder } from './MorphoPaybackWithdrawActionBuilder'
import { MorphoOpenPositionActionBuilder } from './MorphoOpenPositionActionBuilder'

export const MorphoStepBuilders: Partial<ActionBuildersMap> = {
  [SimulationSteps.DepositBorrow]: MorphoDepositBorrowActionBuilder,
  [SimulationSteps.PaybackWithdraw]: MorphoPaybackWithdrawActionBuilder,
  [SimulationSteps.OpenPosition]: MorphoOpenPositionActionBuilder,
}
