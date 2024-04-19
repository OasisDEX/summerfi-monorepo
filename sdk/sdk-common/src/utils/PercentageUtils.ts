import { Percentage } from '../common/implementation/Percentage'
import { TokenAmount } from '../common/implementation/TokenAmount'

export function applyPercentage(tokenAmount: TokenAmount, percentage: Percentage): TokenAmount {
  const amountBN = tokenAmount.toBN()
  const newAmountBN = amountBN.times(percentage.value).div(100)
  return TokenAmount.createFrom({ token: tokenAmount.token, amount: newAmountBN.toString() })
}

export function addPercentage(tokenAmount: TokenAmount, percentage: Percentage): TokenAmount {
  const amountBN = tokenAmount.toBN()
  const newAmount = amountBN.times(percentage.value).div(100)
  return TokenAmount.createFrom({
    token: tokenAmount.token,
    amount: amountBN.plus(newAmount).toString(),
  })
}

export function subtractPercentage(tokenAmount: TokenAmount, percentage: Percentage): TokenAmount {
  const amountBN = tokenAmount.toBN()
  const newAmount = amountBN.times(percentage.value).div(100)
  
  return TokenAmount.createFrom({
    token: tokenAmount.token,
    amount: amountBN.minus(newAmount).toString(),
  })
}
