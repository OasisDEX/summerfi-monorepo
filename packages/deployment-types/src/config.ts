import { DependencyConfig } from '~deployment-config'
import { ProtocolsConfig } from '~deployment-config'
import { SystemConfig } from './system/system'

export type Config = {
  system: SystemConfig
  dependencies: DependencyConfig
  protocols: ProtocolsConfig
}
