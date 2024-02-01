import { Address } from '~deployment-config'
import { MiscDependencyNames } from './misc'
import { TokenDependencyNames } from './tokens'

export type MiscDependencyConfigEntry = {
  name: MiscDependencyNames
  address: Address
  addToRegistry?: boolean
}

export type TokenDependencyConfigEntry = {
  name: TokenDependencyNames
  address: Address
  addToRegistry?: boolean
}

export type MiscDependencyConfigType = Record<MiscDependencyNames, MiscDependencyConfigEntry>
export type TokenDependencyConfigType = Record<TokenDependencyNames, TokenDependencyConfigEntry>

export type DependencyConfigType = {
  misc: MiscDependencyConfigType
  tokens: TokenDependencyConfigType
}
