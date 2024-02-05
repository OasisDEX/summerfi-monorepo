import { Config } from '@summerfi/deployment-types'
import { SystemConfiguration } from '../system'
import { DependenciesConfiguration } from './dependencies/dependencies'
import { ProtocolsConfiguration } from './protocols/protocols'

export const MainnetConfig: Config = {
  system: SystemConfiguration,
  dependencies: DependenciesConfiguration,
  protocols: ProtocolsConfiguration,
}
