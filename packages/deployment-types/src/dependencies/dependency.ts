import { Address } from '@summerfi/common'
import { ConfigEntry } from '~deployment-types/common/configEntry'
import { MiscDependencyNames } from './misc'
import { TokenDependencyNames } from './tokens'

export type MiscDependencyConfigEntry = {
  name: MiscDependencyNames
  address: Address
  addToRegistry?: boolean
}

export type TokenDependencyConfigEntry = ConfigEntry & {
  name: TokenDependencyNames
  address: Address
  addToRegistry?: boolean
}

export type MiscDependencyConfig = Record<MiscDependencyNames, MiscDependencyConfigEntry>
export type TokenDependencyConfig = Record<TokenDependencyNames, TokenDependencyConfigEntry>

export type DependenciesConfig = {
  misc: MiscDependencyConfig
  tokens: TokenDependencyConfig
}
