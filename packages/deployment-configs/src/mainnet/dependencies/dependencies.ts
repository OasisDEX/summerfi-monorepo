import { DependenciesConfig } from '@summerfi/deployment-types'
import { MiscDependenciesConfiguration } from './misc'
import { TokensDependeciesConfiguration } from './tokens'

export const DependenciesConfiguration: DependenciesConfig = {
  misc: MiscDependenciesConfiguration,
  tokens: TokensDependeciesConfiguration,
}
