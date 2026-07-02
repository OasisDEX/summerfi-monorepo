import { IFiatCurrencyAmount, IFiatCurrencyAmountData } from '../interfaces/IFiatCurrencyAmount'
import { IPercentage } from '../interfaces/IPercentage'
import { ITokenAmount, ITokenAmountData } from '../interfaces/ITokenAmount'
import { BigNumber } from 'bignumber.js'

/**
 * @param tokenAmount The token amount to multiply
 * @param percentage The percentage to multiply by
 * @returns The resulting token amount
 */
export function multiplyTokenAmountByPercentage(
  tokenAmount: ITokenAmount,
  percentage: IPercentage,
): ITokenAmountData {
  return {
    token: tokenAmount.token,
    amount: new BigNumber(tokenAmount.amount).times(percentage.toProportion()).toString(),
  }
}

/**
 * @param tokenAmount The token amount to divide
 * @param percentage The percentage to divide by
 * @returns The resulting token amount
 */
export function divideTokenAmountByPercentage(
  tokenAmount: ITokenAmount,
  percentage: IPercentage,
): ITokenAmountData {
  return {
    token: tokenAmount.token,
    amount: new BigNumber(tokenAmount.amount).div(percentage.toProportion()).toString(),
  }
}

/**
 * @param fiatCurrencyAmount The fiat currency amount to multiply
 * @param percentage The percentage to multiply by
 * @returns The resulting fiat currency amount
 */
export function multiplyFiatCurrencyAmountByPercentage(
  fiatCurrencyAmount: IFiatCurrencyAmount,
  percentage: IPercentage,
): IFiatCurrencyAmountData {
  return {
    fiat: fiatCurrencyAmount.fiat,
    amount: new BigNumber(fiatCurrencyAmount.amount).times(percentage.toProportion()).toString(),
  }
}

/**
 * @param fiatCurrencyAmount The fiat currency amount to divide
 * @param percentage The percentage to divide by
 * @returns The resulting fiat currency amount
 */
export function divideFiatCurrencyAmountByPercentage(
  fiatCurrencyAmount: IFiatCurrencyAmount,
  percentage: IPercentage,
): IFiatCurrencyAmountData {
  return {
    fiat: fiatCurrencyAmount.fiat,
    amount: new BigNumber(fiatCurrencyAmount.amount).div(percentage.toProportion()).toString(),
  }
}
