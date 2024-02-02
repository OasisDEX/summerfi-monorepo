import { SystemAutomationConfig } from '@summerfi/deployment-types'

export const AutomationConfiguration: SystemAutomationConfig = {
  AutomationBot: {
    name: 'AutomationBot',
    addToRegistry: true,
    constructorArgs: [],
  },
  AutomationBotV2: {
    name: 'AutomationBotV2',
    addToRegistry: true,
    constructorArgs: [],
  },
  AutomationBotAggregator: {
    name: 'AutomationBotAggregator',
    addToRegistry: true,
    constructorArgs: [],
  },
}
