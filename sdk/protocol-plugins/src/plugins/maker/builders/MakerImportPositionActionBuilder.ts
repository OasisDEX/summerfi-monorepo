import { ActionBuilderParams, ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { ProtocolName, steps } from '@summerfi/sdk-common'
import { BaseActionBuilder } from '../../../implementation/BaseActionBuilder'
import { isMakerLendingPoolId } from '../interfaces/IMakerLendingPoolId'

export class MakerImportPositionActionBuilder extends BaseActionBuilder<steps.ImportStep> {
  readonly actions: ActionBuilderUsedAction[] = [
    // Empty on purpose, no definition needs to be generated for this builder
  ]

  async build(params: ActionBuilderParams<steps.ImportStep>): Promise<void> {
    const { protocolsRegistry, step, user, context, positionsManager } = params

    if (!isMakerLendingPoolId(step.inputs.externalPosition.pool.id)) {
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
