import type { ArmadaMigrationType } from '../enums/ArmadaMigrationType'
import type { IFiatCurrencyAmount } from '../interfaces/IFiatCurrencyAmount'
import type { ITokenAmount } from '../interfaces/ITokenAmount'
import type { AddressValue } from './AddressValue'

/** A position in another protocol that can be migrated into an Armada vault. */
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
