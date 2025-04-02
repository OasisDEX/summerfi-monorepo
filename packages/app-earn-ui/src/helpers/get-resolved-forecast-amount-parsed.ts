import { type BigNumber } from 'bignumber.js'

// when user picks different deposit token than vault token
// rawToTokenAmount will be used which is denominated in vault token
// for example user deposits 1 USDC and vault token is USDC, then amountParsed is 1 USDC
// and rawToTokenAmount is undefined
// if user deposits 1 WTBC and vault token is USDC, then amountParsed is 1 WBTC
// and rawToTokenAmount is 98000 USDC
export const getResolvedForecastAmountParsed = ({
  amountParsed,
  rawToTokenAmount,
}: {
  amountParsed: BigNumber
  rawToTokenAmount?: BigNumber
}): BigNumber => {
  return rawToTokenAmount ?? amountParsed
}
