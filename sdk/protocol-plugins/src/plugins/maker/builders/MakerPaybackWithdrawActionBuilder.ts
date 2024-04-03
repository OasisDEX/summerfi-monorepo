import { getValueFromReference, steps } from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'
import { MakerPaybackAction } from '../actions/MakerPaybackAction'
import { MakerWithdrawAction } from '../actions/MakerWithdrawAction'
import { Address, AddressValue } from '@summerfi/sdk-common/common'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { MakerIlkToJoinMap } from '../types/MakerIlkToJoinMap'
import { isMakerPoolId } from '../types/MakerPoolId'
export const MakerPaybackWithdrawActionList: ActionNames[] = ['MakerPayback', 'MakerWithdraw']

export const MakerPaybackWithdrawActionBuilder: ActionBuilder<steps.PaybackWithdrawStep> = async (
  params,
): Promise<void> => {
  const { context, positionsManager, step } = params

  if (!isMakerPoolId(step.inputs.position.pool.poolId)) {
    throw new Error('Maker: Invalid pool id')
  }

  const ilkType = step.inputs.position.pool.poolId.ilkType

  const joinName = MakerIlkToJoinMap[ilkType]
  const joinAddressValue = params.deployment.dependencies[joinName].address as AddressValue
  const joinAddress = Address.createFromEthereum({ value: joinAddressValue })

  const paybackAmount = getValueFromReference(step.inputs.paybackAmount)

  context.addActionCall({
    step: params.step,
    action: new MakerPaybackAction(),
    arguments: {
      pool: step.inputs.position.pool,
      positionsManager: positionsManager,
      amount: getValueFromReference(step.inputs.paybackAmount),
      paybackAll: paybackAmount.toBN().gte(step.inputs.position.debtAmount.toBN()),
    },
    connectedInputs: {},
    connectedOutputs: {
      paybackAmount: 'amountPaidBack',
    },
  })

  context.addActionCall({
    step: step,
    action: new MakerWithdrawAction(),
    arguments: {
      pool: step.inputs.position.pool,
      positionsManager: positionsManager,
      amount: step.inputs.withdrawAmount,
      joinAddress: joinAddress,
    },
    connectedInputs: {},
    connectedOutputs: {
      withdrawAmount: 'amountWithdrawn',
    },
  })
}
