import { steps } from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { isCompoundV3PoolId } from '../types/'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
export const MakerPaybackWithdrawActionList: ActionNames[] = ['MakerPayback', 'MakerWithdraw']

export const CompoundV3ImportPositionActionBuilder: ActionBuilder<steps.ImportStep> = async (
  params,
): Promise<void> => {
  const { protocolsRegistry, step, user, context, positionsManager } = params

  if (!isCompoundV3PoolId(step.inputs.externalPosition.position.pool.poolId)) {
    throw new Error('Maker: Invalid pool id')
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
