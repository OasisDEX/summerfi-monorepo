export const PRICE_DECIMALS = 8n
export const PERCENT_DECIMALS = 4n
export const PRICE_DECIMALS_NUMBER = 8
export const PERCENT_DECIMALS_NUMBER = 4

export const ONE_PERCENT = 100n

export const ONE_DOLLAR = 10n ** PRICE_DECIMALS

export const TWENTY_MILLIONS_DOllARS = 20_000_000n * ONE_DOLLAR

export const TEN_CENTS = 10n ** (PRICE_DECIMALS - 1n)

export const MINIMUM_LTV_TO_SETUP_TRIGGER = 100n // 1%

export const MULTIPLY_DECIMALS = 2n

export const maxUnit256: bigint =
  0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn
