import { ServiceContainer } from './service-container'
import { AavePartialTakeProfitEventBody, mergeValidationResults, ValidationResults } from '~types'
import { PublicClient } from 'viem'
import { Addresses, CurrentTriggerLike } from '@summerfi/triggers-shared'
import { Address, ChainId, safeParseBigInt } from '@summerfi/serverless-shared'
import { GetTriggersResponse } from '@summerfi/triggers-shared/contracts'
import { Logger } from '@aws-lambda-powertools/logger'
import memoize from 'just-memoize'
import {
  aavePartialTakeProfitValidator,
  dmaAaveStopLossValidator,
} from './against-position-validators'
import {
  AddableTrigger,
  automationBotHelper,
  encodeAavePartialTakeProfit,
  encodeAaveStopLoss,
} from './trigger-encoders'
import { encodeFunctionForDpm } from './encode-function-for-dpm'
import { getCurrentAaveStopLoss } from '@summerfi/triggers-calculations'
import { DerivedPrices } from '@summerfi/prices-subgraph'
import { PositionLike, SupportedActions } from '@summerfi/triggers-shared'
import {
  calculateCollateralPriceInDebtBasedOnLtv,
  getAavePosition,
  simulateAutoTakeProfit,
} from '@summerfi/triggers-calculations'

export interface GetAavePartialTakeProfitServiceContainerProps {
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
  trigger: AavePartialTakeProfitEventBody
  triggers: GetTriggersResponse
  position: PositionLike
  logger?: Logger
}): Promise<{ result: false } | { result: true; addableStopLoss: AddableTrigger }> => {
  if (trigger.triggerData.stopLoss) {
    const currentStopLoss = getCurrentAaveStopLoss(triggers, position, logger)

    const { addableTrigger: addableStopLoss } = encodeAaveStopLoss(
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

export const getAavePartialTakeProfitServiceContainer: (
  params: GetAavePartialTakeProfitServiceContainerProps,
) => ServiceContainer<AavePartialTakeProfitEventBody> = ({
  rpc,
  addresses,
  getTriggers,
  logger,
  chainId,
}) => {
  const getPosition = memoize(async (params: Parameters<typeof getAavePosition>[0]) => {
    return await getAavePosition(
      params,
      rpc,
      {
        poolDataProvider: addresses.AaveV3.AaveDataPoolProvider,
        oracle: addresses.AaveV3.AaveOracle,
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

      const currentStopLoss = getCurrentAaveStopLoss(triggers, position, logger)
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

      const currentStopLoss = getCurrentAaveStopLoss(triggers, position, logger)

      const validationResults: ValidationResults[] = []

      if (trigger.triggerData.stopLoss) {
        const executionPrice = calculateCollateralPriceInDebtBasedOnLtv({
          ...position,
          ltv: trigger.triggerData.stopLoss.triggerData.executionLTV,
        })
        validationResults.push(
          dmaAaveStopLossValidator({
            position,
            executionPrice,
            triggerData: trigger.triggerData.stopLoss.triggerData,
            action: trigger.triggerData.stopLoss.action,
            triggers,
          }),
        )
      }

      validationResults.push(
        aavePartialTakeProfitValidator({
          position,
          triggerData: trigger.triggerData,
          action: trigger.action,
          triggers,
          currentStopLoss: currentStopLoss,
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

      const currentPartialTakeProfit = triggers.triggers.aavePartialTakeProfit
      const currentTrigger: CurrentTriggerLike | undefined = currentPartialTakeProfit
        ? {
            triggerData: currentPartialTakeProfit.triggerData as `0x${string}`,
            id: safeParseBigInt(currentPartialTakeProfit.triggerId) ?? 0n,
            triggersOnAccount: triggers.triggersCount,
          }
        : undefined

      const takeProfitEncoded = encodeAavePartialTakeProfit(
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
  } as ServiceContainer<AavePartialTakeProfitEventBody>
}
