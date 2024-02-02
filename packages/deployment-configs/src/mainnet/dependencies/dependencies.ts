import { DependencyConfig } from '@summerfi/deployment-types'
import { MiscDependenciesConfiguration } from './mainnet.misc'
import { TokensDependeciesConfiguration } from './mainnet.tokens'

export const DependenciesConfiguration: DependencyConfig = {
  misc: MiscDependenciesConfiguration,
  tokens: TokensDependeciesConfiguration,
}
