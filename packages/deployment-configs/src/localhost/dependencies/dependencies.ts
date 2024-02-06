import { DependencyConfig } from '@summerfi/deployment-types'
import { MiscDependenciesConfiguration } from './misc'
import { TokensDependeciesConfiguration } from './tokens'

export const DependenciesConfiguration: DependencyConfig = {
  misc: MiscDependenciesConfiguration,
  tokens: TokensDependeciesConfiguration,
}
