import { steps } from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { isCompoundV3PoolId } from '../types/'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
export const CompoundV3PaybackWithdrawActionList: ActionNames[] = [
  'CompoundV3Payback',
  'CompoundV3Withdraw',
]

export const CompoundV3ImportPositionActionBuilder: ActionBuilder<steps.ImportStep> = async (
  params,
): Promise<void> => {
  const { protocolsRegistry, step, user, context, positionsManager } = params
  if (!isCompoundV3PoolId(step.inputs.externalPosition.position.pool.poolId)) {
    throw new Error('Compound V3: Invalid pool id')
  }

  const compoundPlugin = protocolsRegistry.getPlugin({ protocolName: ProtocolName.CompoundV3 })
  if (!compoundPlugin) {
    throw new Error('Compound V3 plugin not found')
  }

  const importPositionTransaction = await compoundPlugin.getImportPositionTransaction({
    user: user,
    externalPosition: step.inputs.externalPosition,
    positionsManager: positionsManager,
  })

  if (!importPositionTransaction) {
    throw new Error('Compound V3 : Import position transaction not found')
  }

  context.addTransaction({ transaction: importPositionTransaction })
}
