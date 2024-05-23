import { ActionBuildersConfig } from '@summerfi/order-planner-service/config/Config'
import { ProtocolPluginsRecord } from '@summerfi/protocol-plugins'
import { ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { SimulationSteps, SimulationStrategy, StrategyStep } from '@summerfi/sdk-common/simulation'
import { StrategyDefinitions } from './Types'

export function processStrategies(strategyConfigs: SimulationStrategy[]): StrategyDefinitions {
  return strategyConfigs.reduce((acc, strategy) => {
    acc.push(...processStrategy(strategy))

    return acc
  }, [] as StrategyDefinitions)
}

export function processStrategy(strategyConfig: SimulationStrategy): StrategyDefinitions {
  const strategyDefinitions = strategyConfig.reduce(
    (acc, stepConfig) => {
      const suffixes = processStep(stepConfig)
      return combinePrefixesAndSuffixes(acc, suffixes)
    },
    [[]] as StrategyDefinitions,
  )

  return filterIncompatibleStrategies(strategyDefinitions)
}

export function processActionsList(
  stepType: SimulationSteps,
  actionsList: ActionBuilderUsedAction[],
): StrategyDefinitions {
  return actionsList.reduce(
    (acc, actionConfig) => {
      const suffixes = processAction(stepType, actionConfig)
      return combinePrefixesAndSuffixes(acc, suffixes)
    },
    [[]] as StrategyDefinitions,
  )
}

export function processStep(stepConfig: StrategyStep): StrategyDefinitions {
  const stepDefinitions = processActionsList(
    stepConfig.step,
    new ActionBuildersConfig[stepConfig.step]().actions,
  )

  if (stepConfig.optional) {
    return [...stepDefinitions, []]
  } else {
    return stepDefinitions
  }
}

export function processAction(
  stepType: SimulationSteps,
  actionConfig: ActionBuilderUsedAction,
): StrategyDefinitions {
  if (actionConfig.action === 'DelegatedToProtocol') {
    return processDelegateToProtocol(stepType)
  }
  const action = new actionConfig.action()
  const definition = [[{ name: action.config.name, hash: action.getActionHash() }]]

  if (actionConfig.isOptionalTags !== undefined) {
    definition.push([])
  }

  return definition
}

export function processDelegateToProtocol(stepType: SimulationSteps): StrategyDefinitions {
  return Object.values(ProtocolPluginsRecord).reduce((acc, pluginClass) => {
    const plugin = new pluginClass()

    const pluginBuilder = plugin.getActionBuilder(stepType)
    if (!pluginBuilder) {
      return acc
    }

    const suffixes = processActionsList(stepType, pluginBuilder.actions)
    acc.push(...suffixes)
    return acc
  }, [] as StrategyDefinitions)
}

export function combinePrefixesAndSuffixes(
  prefixes: StrategyDefinitions,
  suffixes: StrategyDefinitions,
): StrategyDefinitions {
  return suffixes.reduce((acc, suffix) => {
    acc.push(...prefixes.map((prefix) => [...prefix, ...suffix]))
    return acc
  }, [] as StrategyDefinitions)
}

export function filterIncompatibleStrategies(strategies: StrategyDefinitions): StrategyDefinitions {
  return strategies.filter((strategy) => {
    const strategyLowercase = strategy.map((action) => action.name.toLowerCase())

    const setEmodeAction = strategyLowercase.find((action) => {
      return action.includes('setemode')
    })

    if (!setEmodeAction) {
      return true
    }

    const depositAction = strategyLowercase.find((action) => {
      return action.includes('deposit')
    })

    if (!depositAction) {
      return true
    }

    const setEmodeProtocol = setEmodeAction?.split('setemode')[0]
    const depositProtocol = depositAction?.split('deposit')[0]

    if (setEmodeProtocol === depositProtocol) {
      console.log('strategy', strategy)
      console.log('depositAction', depositAction)
      console.log('setEmodeAction', setEmodeAction)
      console.log('setEmodeProtocol', setEmodeProtocol)
      console.log('depositProtocol', depositProtocol)
    }

    return setEmodeProtocol === depositProtocol
  })
}
