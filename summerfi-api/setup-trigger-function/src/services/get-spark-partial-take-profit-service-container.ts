import { ServiceContainer } from './service-container'
import { mergeValidationResults, SparkPartialTakeProfitEventBody, ValidationResults } from '~types'
import { PublicClient } from 'viem'
import { Addresses, CurrentTriggerLike } from '@summerfi/triggers-shared'
import { Address, ChainId, safeParseBigInt } from '@summerfi/serverless-shared'
import { GetTriggersResponse } from '@summerfi/triggers-shared/contracts'
import { Logger } from '@aws-lambda-powertools/logger'
import memoize from 'just-memoize'
import {
  dmaSparkStopLossValidator,
  sparkPartialTakeProfitValidator,
} from './against-position-validators'
import {
  AddableTrigger,
  automationBotHelper,
  encodeSparkPartialTakeProfit,
  encodeSparkStopLoss,
} from './trigger-encoders'
import { encodeFunctionForDpm } from './encode-function-for-dpm'
import { DerivedPrices } from '@summerfi/prices-subgraph'
import { getCurrentSparkStopLoss } from '@summerfi/triggers-calculations'
import {
  calculateCollateralPriceInDebtBasedOnLtv,
  getSparkPosition,
  simulateAutoTakeProfit,
} from '@summerfi/triggers-calculations'
import { PositionLike, SupportedActions } from '@summerfi/triggers-shared'

export interface GetSparkPartialTakeProfitServiceContainerProps {
  rpc: PublicClient
  addresses: Addresses
  getTriggers: (address: Address) => Promise<GetTriggersResponse>
  getLatestPrice: (token: Address, denomination: Address) => Promise<DerivedPrices | undefined>
  logger?: Logger
  chainId: ChainId
}

const getIfThereIsAStopLossToChange = async ({
  trigger,
  triggers,
  position,
  logger,
}: {
  trigger: SparkPartialTakeProfitEventBody
  triggers: GetTriggersResponse
  position: PositionLike
  logger?: Logger
}): Promise<{ result: false } | { result: true; addableStopLoss: AddableTrigger }> => {
  const currentStopLoss = getCurrentSparkStopLoss(triggers, position, logger)
  if (trigger.triggerData.stopLoss) {
    const { addableTrigger: addableStopLoss } = encodeSparkStopLoss(
      position,
      trigger.triggerData.stopLoss.triggerData,
      currentStopLoss,
    )

    const isTheSameTriggerData = addableStopLoss.encodedTriggerData === currentStopLoss?.triggerData

    return {
      result: !isTheSameTriggerData,
      addableStopLoss,
    }
  }

  return {
    result: false,
  }
}

export const getSparkPartialTakeProfitServiceContainer: (
  params: GetSparkPartialTakeProfitServiceContainerProps,
) => ServiceContainer<SparkPartialTakeProfitEventBody> = ({
  rpc,
  addresses,
  getTriggers,
  logger,
  chainId,
}) => {
  const getPosition = memoize(async (params: Parameters<typeof getSparkPosition>[0]) => {
    return await getSparkPosition(
      params,
      rpc,
      {
        poolDataProvider: addresses.Spark.SparkDataPoolProvider,
        oracle: addresses.Spark.SparkOracle,
      },
      logger,
    )
  })
  return {
    simulatePosition: async ({ trigger }) => {
      const position = await getPosition({
        address: trigger.dpm,
        collateral: trigger.position.collateral,
        debt: trigger.position.debt,
      })
      const triggers = await getTriggers(trigger.dpm)

      const currentStopLoss = getCurrentSparkStopLoss(triggers, position, logger)
      const choosenStopLossExecutionLtv = trigger.triggerData.stopLoss?.triggerData.executionLTV
      const minimalStopLossInformation = choosenStopLossExecutionLtv
        ? { executionLTV: choosenStopLossExecutionLtv }
        : currentStopLoss
      return simulateAutoTakeProfit({
        position,
        currentStopLoss: minimalStopLossInformation,
        minimalTriggerData: trigger.triggerData,
        logger,
      })
    },
    validate: async ({ trigger }) => {
      const position = await getPosition({
        address: trigger.dpm,
        collateral: trigger.position.collateral,
        debt: trigger.position.debt,
      })

      const triggers = await getTriggers(trigger.dpm)

      const currentStopLoss = getCurrentSparkStopLoss(triggers, position, logger)

      const validationResults: ValidationResults[] = []

      if (trigger.triggerData.stopLoss) {
        const executionPrice = calculateCollateralPriceInDebtBasedOnLtv({
          ...position,
          ltv: trigger.triggerData.stopLoss.triggerData.executionLTV,
        })
        validationResults.push(
          dmaSparkStopLossValidator({
            position,
            executionPrice,
            triggerData: trigger.triggerData.stopLoss.triggerData,
            action: trigger.triggerData.stopLoss.action,
            triggers,
          }),
        )
      }

      validationResults.push(
        sparkPartialTakeProfitValidator({
          position,
          triggerData: trigger.triggerData,
          action: trigger.action,
          currentStopLoss,
          triggers,
          chainId,
        }),
      )
      return mergeValidationResults(validationResults)
    },
    getTransaction: async ({ trigger }) => {
      const action = trigger.action
      const triggers = await getTriggers(trigger.dpm)
      const position = await getPosition({
        address: trigger.dpm,
        collateral: trigger.position.collateral,
        debt: trigger.position.debt,
      })

      const currentPartialTakeProfit = triggers.triggers.sparkPartialTakeProfit
      const currentTrigger: CurrentTriggerLike | undefined = currentPartialTakeProfit
        ? {
            triggerData: currentPartialTakeProfit.triggerData as `0x${string}`,
            id: safeParseBigInt(currentPartialTakeProfit.triggerId) ?? 0n,
            triggersOnAccount: triggers.triggersCount,
          }
        : undefined

      const takeProfitEncoded = encodeSparkPartialTakeProfit(
        position,
        trigger.triggerData,
        currentTrigger,
      )

      const stopLoss = await getIfThereIsAStopLossToChange({
        trigger,
        triggers,
        position,
        logger,
      })

      const addableTriggers = stopLoss.result
        ? [takeProfitEncoded.addableTrigger, stopLoss.addableStopLoss]
        : [takeProfitEncoded.addableTrigger]

      const triggerTx =
        action === SupportedActions.Remove
          ? takeProfitEncoded.removableTrigger
            ? automationBotHelper.removeTriggers(
                triggers.triggersCount === 1,
                takeProfitEncoded.removableTrigger,
              )
            : undefined
          : automationBotHelper.addTriggers(...addableTriggers)

      if (triggerTx === undefined) {
        throw new Error('txData is undefined')
      }

      const transaction = encodeFunctionForDpm(
        {
          dpm: trigger.dpm,
          triggerTxData: triggerTx,
        },
        addresses,
      )

      return {
        encodedTriggerData: takeProfitEncoded.addableTrigger.encodedTriggerData,
        transaction,
      }
    },
  } as ServiceContainer<SparkPartialTakeProfitEventBody>
}
