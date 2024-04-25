import { ActionBuildersMap } from '@summerfi/protocol-plugins-common'
import { SparkDepositBorrowActionBuilder } from './SparkDepositBorrowActionBuilder'
import { SimulationSteps } from '@summerfi/sdk-common/simulation'

export const SparkStepBuilders: Partial<ActionBuildersMap> = {
  [SimulationSteps.DepositBorrow]: SparkDepositBorrowActionBuilder,
}
