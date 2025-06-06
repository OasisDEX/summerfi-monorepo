import { BigNumber } from 'bignumber.js'
import { Denomination } from '../types/Denomination'
import { FiatCurrency, isFiatCurrency } from '../enums/FiatCurrency'
import { IPercentage } from '../interfaces/IPercentage'

import { isToken, type IToken } from '../interfaces/IToken'
import {
  type ITokenAmount,
  type ITokenAmountData,
  type IFiatCurrencyAmount,
  type IFiatCurrencyAmountData,
  IPriceData,
  type IPrice,
} from '../interfaces/ITokenAmount'

/**
 * Multiply a token amount by a price
 * @param tokenAmount The token amount to multiply
 * @param price The price to multiply by
 * @returns The resulting token amount or currency amount depending on the price quote
 */
export function multiplyTokenAmountByPrice(
  tokenAmount: ITokenAmount,
  price: IPrice,
): ITokenAmountData | IFiatCurrencyAmountData {
  _validateTokenDenomination(tokenAmount.token, price.base)

  const amount = new BigNumber(tokenAmount.amount).times(new BigNumber(price.value)).toString()
  if (isToken(price.quote)) {
    return {
      token: price.quote,
      amount: amount,
    }
  } else {
    return {
      fiat: price.quote,
      amount: amount,
    }
  }
}

/**
 * Multiply a fiat currency amount by a price
 * @param fiatCurrencyAmount The fiat currency amount to multiply
 * @param price The price to multiply by
 * @returns The resulting fiat currency amount or token amount depending on the price quote
 */
export function multiplyFiatCurrencyAmountByPrice(
  fiatCurrencyAmount: IFiatCurrencyAmount,
  price: IPrice,
): IFiatCurrencyAmountData | ITokenAmountData {
  _validateFiatDenomination(fiatCurrencyAmount.fiat, price.base)

  const amount = new BigNumber(fiatCurrencyAmount.amount)
    .times(new BigNumber(price.value))
    .toString()

  if (isToken(price.quote)) {
    return {
      token: price.quote,
      amount: amount,
    }
  } else {
    return {
      fiat: price.quote,
      amount: amount,
    }
  }
}

/**
 * Multiply a price by another price
 * @param price The price to multiply
 * @param multiplier The price to multiply by
 * @returns The resulting price
 */
export function multiplyPriceByPrice(price: IPrice, multiplier: IPrice): IPriceData {
  if (_hasBaseSameToOtherQuote(price, multiplier) && _hasQuoteSameToOtherBase(price, multiplier)) {
    throw new Error(
      `Multiplying by a price with same denominations but inverted is not supported: ${price} * ${multiplier}`,
    )
  }

  if (_hasBaseSameToOtherQuote(price, multiplier)) {
    return {
      value: price.toBigNumber().times(multiplier.toBigNumber()).toString(),
      base: price.base,
      quote: multiplier.quote,
    }
  } else if (_hasQuoteSameToOtherBase(price, multiplier)) {
    return {
      value: price.toBigNumber().times(multiplier.toBigNumber()).toString(),
      base: multiplier.base,
      quote: price.quote,
    }
  } else {
    throw new Error(`Either : ${price} * ${multiplier}`)
  }
}

/**
 * Divide a price by another price
 * @param price The price to divide
 * @param otherPrice The price to divide by
 * @returns The resulting price
 */
export function dividePriceByPrice(price: IPrice, otherPrice: IPrice): IPriceData {
  if (price.hasSameDenominations(otherPrice)) {
    throw new Error(
      `Dividing by a price with same denominations is not supported: ${price} / ${otherPrice}`,
    )
  }

  if (price.hasSameBase(otherPrice)) {
    return {
      value: price.toBigNumber().div(otherPrice.toBigNumber()).toString(),
      base: otherPrice.quote,
      quote: price.quote,
    }
  } else {
    // Same quote
    return {
      value: price.toBigNumber().div(otherPrice.toBigNumber()).toString(),
      base: price.base,
      quote: otherPrice.base,
    }
  }
}

/**
 * Multiplies a price by a percentage
 * @param price The price to multiply
 * @param percentage The percentage to multiply by
 * @returns The resulting price
 */
export function multiplyPriceByPercentage(price: IPrice, percentage: IPercentage): IPriceData {
  return {
    value: price.toBigNumber().times(percentage.toProportion()).toString(),
    base: price.base,
    quote: price.quote,
  }
}

/**
 * Divides a price by a percentage
 * @param price The price to divide
 * @param percentage The percentage to divide by
 * @returns The resulting price
 */
export function dividePriceByPercentage(price: IPrice, percentage: IPercentage): IPriceData {
  return {
    value: price.toBigNumber().dividedBy(percentage.toProportion()).toString(),
    base: price.base,
    quote: price.quote,
  }
}

/**
 * Validate that the given amount has the given denomination
 * @param tokenAmount The token amount to validate
 * @param denomination The denomination to validate
 *
 * @throws If the given denomination is not a token or if the symbol does not match the token symbol
 *
 * Asserts that the given denomination is a fiat currency
 */
function _validateTokenDenomination(
  token: IToken,
  denomination: Denomination,
): asserts denomination is IToken {
  if (!isToken(denomination)) {
    throw new Error(
      `Price base must be a token to multiply by a token amount, but it is a fiat currency: ${denomination}`,
    )
  } else if (!denomination.equals(token)) {
    throw new Error(
      `Price base ${denomination.symbol} must be the same as the token amount symbol ${token.symbol}`,
    )
  }
}

/**
 * @name _validateFiatDenomination
 * @description Validate that the given fiat currency has the given denomination
 * @param fiat The fiat currency to validate
 * @param denomination The denomination to validate
 *
 * @throws If the given denomination is not a fiat currency
 *
 * Asserts that the given denomination is a fiat currency
 */
function _validateFiatDenomination(
  fiat: FiatCurrency,
  denomination: Denomination,
): asserts denomination is FiatCurrency {
  if (isToken(denomination)) {
    throw new Error(
      `The given denomination is a token and should be fiat currency: ${fiat} != ${denomination.symbol}`,
    )
  } else if (denomination !== fiat) {
    throw new Error(`The denomination ${denomination} is different from the fiat currency ${fiat}`)
  }
}

/**
 * @name _hasBaseSameToThisQuote
 * @param price Price to compare against
 * @returns true if the price base is the same as this price quote
 */
function _hasBaseSameToOtherQuote(price: IPrice, other: IPrice): boolean {
  if (isToken(price.quote)) {
    if (isFiatCurrency(other.base) || !price.quote.equals(other.base)) {
      return false
    }
  } else {
    if (!isFiatCurrency(other.base) || price.quote !== other.base) {
      return false
    }
  }

  return true
}

/**
 * @name _hasQuoteSameToThisBase
 * @param price Price to compare against
 * @returns true if the price quote is the same as this price base
 */
function _hasQuoteSameToOtherBase(price: IPrice, other: IPrice): boolean {
  if (isToken(price.base)) {
    if (isFiatCurrency(other.quote) || !price.base.equals(other.quote)) {
      return false
    }
  } else {
    if (!isFiatCurrency(other.quote) || price.base !== other.quote) {
      return false
    }
  }

  return true
}
