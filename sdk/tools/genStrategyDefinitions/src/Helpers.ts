import { ActionBuildersConfig } from '@summerfi/order-planner-service'
import { ProtocolPluginsRecord } from '@summerfi/protocol-plugins'
import { ActionBuilderUsedAction } from '@summerfi/protocol-plugins-common'
import { SimulationStrategy, StrategyStep, AddressValue, HexData } from '@summerfi/sdk-common'
import {
  DebugDefinitions,
  OperationDefinition,
  OperationDefinitions,
  StrategyDefinitions,
  Transactions,
} from './Types'
import { TxBuilder } from '@morpho-labs/gnosis-tx-builder'
import { encodeFunctionData, parseAbi } from 'viem'
import { BatchFile } from '@morpho-labs/gnosis-tx-builder/lib/src/types'

const DISABLE_OPTIONALS = true

export function generateSafeMultisendJSON(
  safeAddress: AddressValue,
  operationsRegistryAddress: AddressValue,
  operationDefinitions: OperationDefinitions,
): BatchFile {
  const transactions = generateTransactions(operationsRegistryAddress, operationDefinitions)

  return TxBuilder.batch(safeAddress, transactions)
}

export function generateTransactions(
  safeAddress: AddressValue,
  operationDefinitions: OperationDefinitions,
): Transactions {
  return operationDefinitions.map((operationDefinition) => {
    return {
      to: safeAddress,
      value: '0',
      data: encodeOpRegistryParameters(operationDefinition),
    }
  })
}

export function encodeOpRegistryParameters(operationDefinition: OperationDefinition): HexData {
  const opRegistryAbi = parseAbi(['function addOperation((bytes32[],bool[], string))'])

  return encodeFunctionData({
    abi: opRegistryAbi,
    functionName: 'addOperation',
    args: [[operationDefinition.actions, operationDefinition.optional, operationDefinition.name]],
  })
}

export function generateOperationDefinitions(
  strategyName: string,
  strategyDefinitions: StrategyDefinitions,
): OperationDefinitions {
  return strategyDefinitions.map((strategy) => {
    const paybackAction = strategy.find((action) => {
      return action.name.includes('Payback')
    })

    const depositAction = strategy.find((action) => {
      return action.name.includes('Deposit')
    })

    if (!paybackAction || !depositAction) {
      throw new Error('Cannot find payback or deposit action')
    }

    const fromProtocol = paybackAction.name.split('Payback')[0]
    const toProtocol = depositAction.name.split('Deposit')[0]

    return {
      actions: strategy.map((action) => action.hash),
      optional: strategy.map((action) => action.optional),
      name: `${strategyName}${fromProtocol}${toProtocol}`,
    }
  })
}

export function generateDebugDefinitions(
  strategyName: string,
  strategyDefinitions: StrategyDefinitions,
): DebugDefinitions {
  return strategyDefinitions.map((strategy) => {
    const paybackAction = strategy.find((action) => {
      return action.name.includes('Payback')
    })

    const depositAction = strategy.find((action) => {
      return action.name.includes('Deposit')
    })

    if (!paybackAction || !depositAction) {
      throw new Error('Cannot find payback or deposit action')
    }

    const fromProtocol = paybackAction.name.split('Payback')[0]
    const toProtocol = depositAction.name.split('Deposit')[0]

    return {
      operationName: `${strategyName}${fromProtocol}${toProtocol}`,
      operation: strategy,
    }
  })
}

export function processStrategies(strategyConfigs: SimulationStrategy[]): StrategyDefinitions {
  const strategyDefinitions = strategyConfigs.reduce((acc, strategy) => {
    acc.push(...processStrategy(strategy))

    return acc
  }, [] as StrategyDefinitions)

  return filterDuplicateStrategies(strategyDefinitions)
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
  stepConfig: StrategyStep,
  actionsList: ActionBuilderUsedAction[],
): StrategyDefinitions {
  return actionsList.reduce(
    (acc, actionConfig) => {
      const suffixes = processAction(stepConfig, actionConfig)
      return combinePrefixesAndSuffixes(acc, suffixes)
    },
    [[]] as StrategyDefinitions,
  )
}

export function processStep(stepConfig: StrategyStep): StrategyDefinitions {
  const stepDefinitions = processActionsList(
    stepConfig,
    new ActionBuildersConfig[stepConfig.step]().actions,
  )

  if (!DISABLE_OPTIONALS && stepConfig.optional) {
    return [...stepDefinitions, []]
  } else {
    return stepDefinitions
  }
}

export function processAction(
  stepConfig: StrategyStep,
  actionConfig: ActionBuilderUsedAction,
): StrategyDefinitions {
  if (actionConfig.action === 'DelegatedToProtocol') {
    return processDelegateToProtocol(stepConfig)
  }
  const action = new actionConfig.action()
  const definition = [
    [
      {
        name: action.config.name,
        versionedName: action.getVersionedName(),
        hash: action.getActionHash(),
        optional:
          DISABLE_OPTIONALS || stepConfig.optional || actionConfig.isOptionalTags !== undefined,
      },
    ],
  ]

  if (!DISABLE_OPTIONALS && actionConfig.isOptionalTags !== undefined) {
    definition.push([])
  }

  return definition
}

export function processDelegateToProtocol(stepConfig: StrategyStep): StrategyDefinitions {
  return Object.values(ProtocolPluginsRecord).reduce((acc, pluginClass) => {
    const plugin = new pluginClass()

    const pluginBuilder = plugin.getActionBuilder(stepConfig.step)
    if (!pluginBuilder) {
      return acc
    }

    const suffixes = processActionsList(stepConfig, pluginBuilder.actions)
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

    const depositAction = strategyLowercase.find((action) => {
      return action.includes('deposit')
    })

    if (setEmodeAction === undefined && depositAction !== undefined) {
      const protocol = depositAction.split('deposit')[0]

      return protocol !== 'aavev3' && protocol !== 'spark'
    }

    const setEmodeProtocol = setEmodeAction?.split('setemode')[0]
    const depositProtocol = depositAction?.split('deposit')[0]

    return setEmodeProtocol === depositProtocol
  })
}

export function filterDuplicateStrategies(strategies: StrategyDefinitions): StrategyDefinitions {
  return strategies.filter((strategy, index) => {
    return strategies.findIndex((s) => JSON.stringify(s) === JSON.stringify(strategy)) === index
  })
}
