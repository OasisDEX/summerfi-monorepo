import { ActionCallBuilder, ActionParameters } from '~orderplanner/interfaces'
import { isPullTokenParameters } from '~orderplanner/protocols/common'
import { encodeAction } from '~orderplanner/utils/EncodeAction'

export const pullToken: ActionCallBuilder = (
  contractNameWithVersion: string,
  parameters: ActionParameters,
  paramsMapping: number[] = [],
) => {
  if (!isPullTokenParameters(parameters)) {
    throw new Error('PullToken: invalid parameters when building call')
  }

  return encodeAction(
    contractNameWithVersion,
    'tuple(address asset, address from, uint256 amount)',
    [parameters.amount, parameters.amount.token.address, parameters.from],
    paramsMapping,
  )
}
