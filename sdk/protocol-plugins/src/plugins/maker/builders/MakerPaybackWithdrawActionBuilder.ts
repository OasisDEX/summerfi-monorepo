import { getValueFromReference, steps } from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'
import { MakerPaybackAction } from '../actions/MakerPaybackAction'
import { MakerWithdrawAction } from '../actions/MakerWithdrawAction'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
import { MakerIlkToJoinMap } from '../types/MakerIlkToJoinMap'
import { isMakerLendingPoolId } from '../interfaces/IMakerLendingPoolId'
import { getContractAddress } from '../../utils/GetContractAddress'
export const MakerPaybackWithdrawActionList: ActionNames[] = ['MakerPayback', 'MakerWithdraw']

export const MakerPaybackWithdrawActionBuilder: ActionBuilder<steps.PaybackWithdrawStep> = async (
  params,
): Promise<void> => {
  const { context, user, positionsManager, step, addressBookManager } = params

  if (!isMakerLendingPoolId(step.inputs.position.pool.id)) {
    throw new Error('Maker: Invalid pool id')
  }

  const ilkType = step.inputs.position.pool.id.ilkType

  const joinName = MakerIlkToJoinMap[ilkType]
  const joinAddress = await getContractAddress({
    addressBookManager,
    chainInfo: user.chainInfo,
    contractName: joinName,
  })

  const paybackAmount = getValueFromReference(step.inputs.paybackAmount)

  if (!paybackAmount.toBN().isZero()) {
    context.addActionCall({
      step: params.step,
      action: new MakerPaybackAction(),
      arguments: {
        position: step.inputs.position,
        positionsManager: positionsManager,
        amount: getValueFromReference(step.inputs.paybackAmount),
        paybackAll: paybackAmount.toBN().gte(step.inputs.position.debtAmount.toBN()),
      },
      connectedInputs: {},
      connectedOutputs: {
        paybackAmount: 'amountPaidBack',
      },
    })
  }

  context.addActionCall({
    step: step,
    action: new MakerWithdrawAction(),
    arguments: {
      position: step.inputs.position,
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
