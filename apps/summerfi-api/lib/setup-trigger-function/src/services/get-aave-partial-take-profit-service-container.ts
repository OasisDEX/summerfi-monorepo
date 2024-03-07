import { ServiceContainer } from './service-container'
import { AavePartialTakeProfitEventBody, PositionLike, SupportedActions } from '~types'
import { PublicClient } from 'viem'
import { Addresses } from './get-addresses'
import { Address, ChainId, safeParseBigInt } from '@summerfi/serverless-shared'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { Logger } from '@aws-lambda-powertools/logger'
import memoize from 'just-memoize'
import { getAavePosition } from './get-aave-position'
import { aavePartialTakeProfitValidator } from './against-position-validators'
import {
  AddableTrigger,
  automationBotHelper,
  CurrentTriggerLike,
  encodeAavePartialTakeProfit,
  encodeAaveStopLoss,
  encodeAaveTrailingStopLoss,
} from './trigger-encoders'
import { encodeFunctionForDpm } from './encode-function-for-dpm'
import { getCurrentAaveStopLoss } from './get-current-aave-stop-loss'
import { DerivedPrices } from '@summerfi/prices-subgraph'
import { simulateAutoTakeProfit } from './simulations'

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
  getLatestPrice,
  logger,
}: {
  trigger: AavePartialTakeProfitEventBody
  triggers: GetTriggersResponse
  position: PositionLike
  getLatestPrice: (token: Address, denomination: Address) => Promise<DerivedPrices | undefined>
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
      result: isTheSameTriggerData,
      addableStopLoss,
    }
  }

  if (trigger.triggerData.trailingStopLoss) {
    const currentStopLoss = getCurrentAaveStopLoss(triggers, position, logger)

    const latestPrice = await getLatestPrice(trigger.position.collateral, trigger.position.debt)

    if (latestPrice === undefined) {
      throw new Error('latestPrice is undefined')
    }

    const { addableTrigger: addableStopLoss } = encodeAaveTrailingStopLoss(
      position,
      trigger.triggerData.trailingStopLoss.triggerData,
      latestPrice,
      currentStopLoss,
    )

    const isTheSameTriggerData =
      trigger.triggerData.trailingStopLoss.triggerData.trailingDistance ===
      safeParseBigInt(triggers.triggers.aaveTrailingStopLossDMA?.decodedParams.trailingDistance)

    if (isTheSameTriggerData) {
      return { result: false }
    }
    return {
      result: true,
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
  getLatestPrice,
  chainId,
}) => {
  const getPosition = memoize(async (params: Parameters<typeof getAavePosition>[0]) => {
    return await getAavePosition(params, rpc, addresses, logger)
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
      return simulateAutoTakeProfit({
        position,
        currentStopLoss,
        minimalTriggerData: trigger.triggerData,
      })
    },
    validate: async ({ trigger }) => {
      const position = await getPosition({
        address: trigger.dpm,
        collateral: trigger.position.collateral,
        debt: trigger.position.debt,
      })

      const triggers = await getTriggers(trigger.dpm)

      return aavePartialTakeProfitValidator({
        position,
        triggerData: trigger.triggerData,
        action: trigger.action,
        triggers,
        chainId,
      })
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
        getLatestPrice,
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
