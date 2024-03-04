import { CurrencySymbol } from '~sdk-common/common/enums'

export function isCurrency(maybeCurrency: unknown): maybeCurrency is CurrencySymbol {
  return Object.values(CurrencySymbol).includes(maybeCurrency as CurrencySymbol)
}
