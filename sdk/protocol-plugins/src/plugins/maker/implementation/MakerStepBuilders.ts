import { ActionBuildersMap } from '@summerfi/protocol-plugins-common'
import { MakerPaybackWithdrawActionBuilder } from '../builders/MakerPaybackWithdrawActionBuilder'
import { MakerImportPositionActionBuilder } from '../builders/MakerImportPositionActionBuilder'
import { SimulationSteps } from '@summerfi/sdk-common'
import { MakerOpenPositionActionBuilder } from '../builders/MakerOpenPositionActionBuilder'

/**
 * @description Map of action builders for the Maker protocol
 */
export const MakerStepBuilders: Partial<ActionBuildersMap> = {
  [SimulationSteps.PaybackWithdraw]: MakerPaybackWithdrawActionBuilder,
  [SimulationSteps.Import]: MakerImportPositionActionBuilder,
  [SimulationSteps.OpenPosition]: MakerOpenPositionActionBuilder,
}
