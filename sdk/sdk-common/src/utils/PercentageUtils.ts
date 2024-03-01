import type { Percentage } from '~sdk-common/common/implementation/Percentage'
import { TokenAmount } from '~sdk-common/common/implementation/TokenAmount'

export function applyPercentage(tokenAmount: TokenAmount, percentage: Percentage): TokenAmount {
  const amountBN = tokenAmount.toBN()
  const newAmount = amountBN.times(percentage.value).div(100)
  return TokenAmount.createFrom({ token: tokenAmount.token, amount: newAmount.toFixed(0) })
}

export function addPercentage(tokenAmount: TokenAmount, percentage: Percentage): TokenAmount {
  const amountBN = tokenAmount.toBN()
  const newAmount = amountBN.times(percentage.value).div(100)
  return TokenAmount.createFrom({
    token: tokenAmount.token,
    amount: amountBN.plus(newAmount).toFixed(0),
  })
}

export function subtractPercentage(tokenAmount: TokenAmount, percentage: Percentage): TokenAmount {
  const amountBN = tokenAmount.toBN()
  const newAmount = amountBN.times(percentage.value).div(100)
  return TokenAmount.createFrom({
    token: tokenAmount.token,
    amount: amountBN.minus(newAmount).toFixed(0),
  })
}
