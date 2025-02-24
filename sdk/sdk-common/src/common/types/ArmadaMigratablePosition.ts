import type { ArmadaMigrationType } from '../enums'
import type { IFiatCurrencyAmount, ITokenAmount } from '../interfaces'
import type { AddressValue } from './AddressValue'

export type ArmadaMigratablePosition = {
  // id is an address of the position
  id: AddressValue
  // type of migration
  migrationType: ArmadaMigrationType
  // amount in the position token
  positionTokenAmount: ITokenAmount
  // amount in the underlying asset
  underlyingTokenAmount: ITokenAmount
  // amount in USD
  usdValue: IFiatCurrencyAmount
}
