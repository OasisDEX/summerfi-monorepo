import { CurrencySymbol } from '../common/enums/CurrencySymbol'

export function isCurrency(maybeCurrency: unknown): maybeCurrency is CurrencySymbol {
  return Object.values(CurrencySymbol).includes(maybeCurrency as CurrencySymbol)
}
