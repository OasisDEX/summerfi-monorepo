import { Config } from '@summerfi/deployment-types'
import { SystemConfiguration } from '~contracts-utils'
import { DependenciesConfiguration } from './dependencies/dependencies'
import { ProtocolsConfiguration } from './protocols/protocols'

export const Configuration: Config = {
  system: SystemConfiguration,
  dependencies: DependenciesConfiguration,
  protocols: ProtocolsConfiguration,
}
