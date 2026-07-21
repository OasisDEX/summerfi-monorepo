import BigNumber from 'bignumber.js'

/**
 * Self-contained copies of the formatters previously imported from `@summerfi/app-utils`
 * (`formatCryptoBalance`, `formatFiatBalance`, `formatAddress`) so the app has no
 * monorepo dependency. Behavior is intentionally identical.
 */

const zero = new BigNumber(0)
const one = new BigNumber(1)
const ten = new BigNumber(10)
const oneThousandth = new BigNumber(0.001)
const thousand = new BigNumber(1000)
const hundredThousand = new BigNumber(100000)
const million = new BigNumber(1000000)
const billion = new BigNumber(1000000000)

const toBigNumber = (value: BigNumber | string | number | bigint): BigNumber =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint'
    ? new BigNumber(value.toString())
    : value

const formatShorthandNumber = (
  amount: BigNumber | string | number | bigint,
  {
    suffix = '',
    precision,
  }: {
    suffix?: string
    precision?: number
  } = {},
): string => {
  const sh = new BigNumber(
    amount
      .toString()
      .split('.')
      .map((part, index) => {
        if (index === 0) return part

        return part.substring(0, precision)
      })
      .filter((el) => el)
      .join('.'),
  )

  if (precision) {
    return sh.toFixed(precision).concat(suffix)
  }

  return sh.toFixed().concat(suffix)
}

const formatAsShorthandNumbers = (
  amount: BigNumber | string | number | bigint,
  {
    suffix = '',
    precision,
  }: {
    suffix?: string
    precision?: number
  } = {},
): string => {
  const resolvedAmount = toBigNumber(amount)

  if (resolvedAmount.absoluteValue().gte(billion)) {
    return formatShorthandNumber(resolvedAmount.dividedBy(billion), { suffix: 'B', precision })
  }
  if (resolvedAmount.absoluteValue().gte(million)) {
    return formatShorthandNumber(resolvedAmount.dividedBy(million), { suffix: 'M', precision })
  }
  if (resolvedAmount.absoluteValue().gte(thousand)) {
    return formatShorthandNumber(resolvedAmount.dividedBy(thousand), { suffix: 'K', precision })
  }

  return formatShorthandNumber(resolvedAmount, { suffix, precision })
}

export const formatCryptoBalance = (
  amount: BigNumber | string | number | bigint,
  prefix?: string,
): string => {
  if (isNaN(Number(amount))) {
    return '-'
  }

  const resolvedAmount = toBigNumber(amount.toString().replaceAll(',', ''))
  const absAmount = resolvedAmount.abs()
  let formattedAmount: string

  if (absAmount.eq(zero)) {
    formattedAmount = formatAsShorthandNumbers(resolvedAmount, { precision: 2 })
  } else if (absAmount.lt(oneThousandth)) {
    formattedAmount = resolvedAmount.isNegative() ? '0.000' : '<0.001'
  } else if (absAmount.lt(ten)) {
    formattedAmount = formatAsShorthandNumbers(resolvedAmount, { precision: 4 })
  } else if (absAmount.lt(hundredThousand)) {
    formattedAmount = formatAsShorthandNumbers(resolvedAmount, { precision: 2 })
  } else if (absAmount.lt(million)) {
    formattedAmount = formatAsShorthandNumbers(resolvedAmount, { precision: 2 })
  } else {
    formattedAmount = formatAsShorthandNumbers(resolvedAmount, { precision: 2 })
  }

  return `${prefix ?? ''}${formattedAmount}`
}

export const formatFiatBalance = (amount: BigNumber | string | number | bigint): string => {
  const resolvedAmount = toBigNumber(amount)

  if (resolvedAmount.lt(new BigNumber('0.01')) && !resolvedAmount.eq(zero)) {
    return '<0.01'
  }

  const absAmount = resolvedAmount.absoluteValue()

  if (absAmount.eq(zero)) return formatAsShorthandNumbers(resolvedAmount, { precision: 2 })
  if (absAmount.lt(one)) return formatAsShorthandNumbers(resolvedAmount, { precision: 4 })
  if (absAmount.lt(million)) return resolvedAmount.toFormat(2, BigNumber.ROUND_DOWN)
  // We don't want to have numbers like 999999 formatted as 999.99k

  return formatAsShorthandNumbers(resolvedAmount, { precision: 2 })
}

export const formatAddress = (
  address: string,
  {
    first = 4,
    last = 5,
  }: {
    first?: number
    last?: number
  } = {},
): string => `${address.slice(0, first)}...${address.slice(-last)}`
