import { ActionBuildersMap } from '@summerfi/protocol-plugins-common'
import { AaveV3DepositBorrowActionBuilder } from './AaveV3DepositBorrowActionBuilder'
import { SimulationSteps } from '@summerfi/sdk-common'
import { AaveV3PaybackWithdrawActionBuilder } from './AaveV3PaybackWithdrawActionBuilder'
import { AaveV3OpenPositionActionBuilder } from './AaveV3OpenPositionActionBuilder'

export const AaveV3StepBuilders: Partial<ActionBuildersMap> = {
    [SimulationSteps.DepositBorrow]: AaveV3DepositBorrowActionBuilder,
    [SimulationSteps.PaybackWithdraw]: AaveV3PaybackWithdrawActionBuilder,
    [SimulationSteps.OpenPosition]: AaveV3OpenPositionActionBuilder,
}
