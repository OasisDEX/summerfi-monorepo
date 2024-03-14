import { getValueFromReference, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder } from '@summerfi/order-planner-common/builders'
import { ActionNames } from '@summerfi/deployment-types'
import { MakerPaybackAction } from '~protocolplugins/maker/actions/MakerPaybackAction'
import { MakerWithdrawAction } from '~protocolplugins/maker/actions/MakerWithdrawAction'
import { Address, AddressValue } from '@summerfi/sdk-common/common'

export const MakerPaybackWithdrawActionList: ActionNames[] = ['MakerPayback', 'MakerWithdraw']

const TokenToJoinMapping: Record<string, string> = {
  // TODO: this is a temporary mapping, we need to integrate with the full protocol plugin
  DAI: 'MCD_JOIN_DAI',
  WETH: 'MCD_JOIN_ETH_A',
}

export const MakerPaybackWithdrawActionBuilder: ActionBuilder<steps.PaybackWithdrawStep> = async (
  params,
): Promise<void> => {
  const { context, user, step } = params

  const joinType = TokenToJoinMapping[step.inputs.position.debtAmount.token.symbol]
  const joinAddressValue = params.deployment.dependencies[joinType].address as AddressValue
  const joinAddress = Address.createFrom({ value: joinAddressValue })

  context.addActionCall({
    step: params.step,
    action: new MakerPaybackAction(),
    arguments: {
      pool: step.inputs.position.pool,
      userAddress: user.wallet.address,
      amount: getValueFromReference(step.inputs.paybackAmount),
      paybackAll: true, // TODO: we cannot always calculate this value because debtAmount and paybackAmount are references
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
      userAddress: user.wallet.address,
      amount: getValueFromReference(step.inputs.withdrawAmount),
      joinAddress: joinAddress,
    },
    connectedInputs: {},
    connectedOutputs: {
      withdrawAmount: 'amountWithdrawn',
    },
  })
}
