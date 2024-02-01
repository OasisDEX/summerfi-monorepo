import { SystemConfigType } from '@summerfi/deployment-types'
import { CoreConfig } from './core.conf'
import { ActionsConfig } from './actions.conf'
import { AutomationConfig } from './automation.conf'

export const SystemConfig: SystemConfigType = {
  core: CoreConfig,
  actions: ActionsConfig,
  automation: AutomationConfig,
}
