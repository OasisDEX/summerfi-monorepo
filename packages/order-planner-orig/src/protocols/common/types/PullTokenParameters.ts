import { Address, TokenAmount } from '@summerfi/sdk/common/index'
import { ActionParameters } from '~orderplanner'

export interface PullTokenParameters extends ActionParameters {
  from: Address
  amount: TokenAmount
}

export function isPullTokenParameters(
  parameters: ActionParameters,
): parameters is PullTokenParameters {
  return (
    typeof parameters === 'object' &&
    parameters !== null &&
    'from' in parameters &&
    'amount' in parameters
  )
}
