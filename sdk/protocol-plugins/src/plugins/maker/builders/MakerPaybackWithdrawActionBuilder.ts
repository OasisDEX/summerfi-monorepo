import { getValueFromReference, steps } from '@summerfi/sdk-common/simulation'
import { ActionNames } from '@summerfi/deployment-types'
import { MakerPaybackAction } from '../actions/MakerPaybackAction'
import { MakerWithdrawAction } from '../actions/MakerWithdrawAction'
import { Address, AddressValue } from '@summerfi/sdk-common/common'
import { ActionBuilder } from '@summerfi/protocol-plugins-common'
export const MakerPaybackWithdrawActionList: ActionNames[] = ['MakerPayback', 'MakerWithdraw']

const TokenToJoinMapping: Record<string, string> = {
  // TODO: this is a temporary mapping, we need to integrate with the full protocol plugin
  DAI: 'MCD_JOIN_DAI',
  WETH: 'MCD_JOIN_ETH_C',
}

export const MakerPaybackWithdrawActionBuilder: ActionBuilder<steps.PaybackWithdrawStep> = async (
  params,
): Promise<void> => {
  const { context, positionsManager, step } = params

  const joinType = TokenToJoinMapping[step.inputs.position.collateralAmount.token.symbol]
  const joinAddressValue = params.deployment.dependencies[joinType].address as AddressValue
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
