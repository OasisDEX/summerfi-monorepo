import { steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilderParams } from '@summerfi/protocol-plugins-common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { isMakerLendingPoolId } from '../interfaces/IMakerLendingPoolId'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'

export class MakerImportPositionActionBuilder extends BaseActionBuilder<steps.ImportStep> {
  async build(params: ActionBuilderParams<steps.ImportStep>): Promise<void> {
    const { protocolsRegistry, step, user, context, positionsManager } = params

    if (!isMakerLendingPoolId(step.inputs.externalPosition.position.pool.id)) {
      throw new Error('Invalid Maker lending pool id')
    }

    const makerPlugin = protocolsRegistry.getPlugin({ protocolName: ProtocolName.Maker })
    if (!makerPlugin) {
      throw new Error('Maker plugin not found')
    }

    const importPositionTransaction = await makerPlugin.getImportPositionTransaction({
      user: user,
      externalPosition: step.inputs.externalPosition,
      positionsManager: positionsManager,
    })

    if (!importPositionTransaction) {
      throw new Error('Maker: Import position transaction not found')
    }

    context.addTransaction({ transaction: importPositionTransaction })
  }
}
