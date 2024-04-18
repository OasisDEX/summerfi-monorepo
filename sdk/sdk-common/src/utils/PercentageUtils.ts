import { Percentage } from '../common/implementation/Percentage'
import { TokenAmount } from '../common/implementation/TokenAmount'

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
    amount: amountBN.plus(newAmount).toString(),
  })
}

export function subtractPercentage(tokenAmount: TokenAmount, percentage: Percentage): TokenAmount {
  const amountBN = tokenAmount.toBN()
  const newAmount = amountBN.times(percentage.value).div(100)

  console.log(percentage, 'percentage')
  console.log(amountBN.toString(), 'amountBN')
  console.log(newAmount.toString(), 'newAmount')
  
  return TokenAmount.createFrom({
    token: tokenAmount.token,
    amount: amountBN.minus(newAmount).toString(),
  })
}
