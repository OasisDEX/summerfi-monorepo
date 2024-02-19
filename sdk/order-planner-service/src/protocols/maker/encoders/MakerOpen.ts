import { ActionCallBuilder, ActionParameters } from '~orderplanner/interfaces'
import { isMakerOpenParameters } from '~orderplanner/protocols/maker'
import { encodeAction } from '~orderplanner/utils/EncodeAction'

export const makerOpen: ActionCallBuilder = (
  contractNameWithVersion: string,
  parameters: ActionParameters,
  paramsMapping: number[] = [],
) => {
  if (!isMakerOpenParameters(parameters)) {
    throw new Error('PullToken: invalid parameters when building call')
  }

  return encodeAction(
    contractNameWithVersion,
    'tuple(address asset, address from, uint256 amount)',
    [parameters.amount, parameters.amount.token.address, parameters.from],
    paramsMapping,
  )
}
