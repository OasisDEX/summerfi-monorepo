import { SystemConfig } from '~deployment-types/system/system'
import { ProtocolsConfig } from '~deployment-types/protocols/protocols'
import { DependenciesConfig } from '~deployment-types/dependencies/dependency'

export type Config = {
  system: SystemConfig
  dependencies: DependenciesConfig
  protocols: ProtocolsConfig
}
