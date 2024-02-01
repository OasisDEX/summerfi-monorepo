import { DependencyConfigType } from '~deployment-config'
import { ProtocolsConfigType } from '~deployment-config'
import { SystemConfigType } from './system/system'

export type Config = {
  system: SystemConfigType
  dependencies: DependencyConfigType
  protocols: ProtocolsConfigType
}
