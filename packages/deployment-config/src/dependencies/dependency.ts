import { Address } from '~deployment-config'
import { MiscDependencyNames } from './misc'
import { TokenDependencyNames } from './tokens'

export type DependencyNames = MiscDependencyNames & TokenDependencyNames

export type DependencyConfigEntry = {
  name: DependencyNames
  address: Address
}

export type DependencyConfigType = Record<DependencyNames, DependencyConfigEntry>
