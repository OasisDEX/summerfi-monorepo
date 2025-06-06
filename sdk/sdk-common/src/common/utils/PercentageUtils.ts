import { IPercentage } from '../interfaces/IPercentage'
import {
  ITokenAmount,
  ITokenAmountData,
  IFiatCurrencyAmount,
  IFiatCurrencyAmountData,
} from '../interfaces/ITokenAmount'
import { BigNumber } from 'bignumber.js'

/**
 * @name multiplyTokenAmountByPercentage
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
 * @name divideTokenAmountByPercentage
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
 * @name multiplyFiatCurrencyAmountByPercentage
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
 * @name divideFiatCurrencyAmountByPercentage
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
