import { SystemConfig } from '@summerfi/deployment-types'
import { CoreConfiguration } from './core.conf'
import { ActionsConfiguration } from './actions.conf'
import { AutomationConfiguration } from './automation.conf'

export const SystemConfiguration: SystemConfig = {
  core: CoreConfiguration,
  actions: ActionsConfiguration,
  automation: AutomationConfiguration,
}
