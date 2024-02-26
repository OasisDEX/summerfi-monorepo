import { ServiceContainer } from './service-container'
import { SparkAutoSellEventBody, SupportedActions } from '~types'
import { PublicClient } from 'viem'
import { Addresses } from './get-addresses'
import { Address, ChainId, safeParseBigInt } from '@summerfi/serverless-shared'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { Logger } from '@aws-lambda-powertools/logger'
import memoize from 'just-memoize'
import { calculateCollateralPriceInDebtBasedOnLtv } from './calculate-collateral-price-in-debt-based-on-ltv'
import { simulatePosition } from './simulate-position'
import { sparkAutoSellValidator } from './against-position-validators'
import { CurrentTriggerLike } from './trigger-encoders'
import { encodeFunctionForDpm } from './encode-function-for-dpm'
import { getSparkPosition } from './get-spark-position'
import { getCurrentSparkStopLoss } from './get-current-spark-stop-loss'
import { encodeSparkAutoSell } from './trigger-encoders/encode-spark-auto-sell'

export interface GetSparkAutoSellServiceContainerProps {
  rpc: PublicClient
  addresses: Addresses
  getTriggers: (address: Address) => Promise<GetTriggersResponse>
  logger?: Logger
  chainId: ChainId
}

export const getSparkAutoSellServiceContainer: (
  props: GetSparkAutoSellServiceContainerProps,
) => ServiceContainer<SparkAutoSellEventBody> = ({
  rpc,
  addresses,
  logger,
  getTriggers,
  chainId,
}) => {
  const getPosition = memoize(async (params: Parameters<typeof getSparkPosition>[0]) => {
    return await getSparkPosition(params, rpc, addresses, logger)
  })

  return {
    simulatePosition: async ({ trigger }) => {
      const position = await getPosition({
        address: trigger.dpm,
        collateral: trigger.position.collateral,
        debt: trigger.position.debt,
      })

      const executionPrice = calculateCollateralPriceInDebtBasedOnLtv({
        ...position,
        ltv: trigger.triggerData.executionLTV,
      })
      return simulatePosition({
        position: position,
        targetLTV: trigger.triggerData.targetLTV,
        executionLTV: trigger.triggerData.executionLTV,
        executionPrice: executionPrice,
      })
    },
    validate: async ({ trigger }) => {
      const position = await getPosition({
        address: trigger.dpm,
        collateral: trigger.position.collateral,
        debt: trigger.position.debt,
      })

      const executionPrice = calculateCollateralPriceInDebtBasedOnLtv({
        ...position,
        ltv: trigger.triggerData.executionLTV,
      })

      const triggers = await getTriggers(trigger.dpm)

      const currentStopLoss = getCurrentSparkStopLoss(triggers, position, logger)

      return sparkAutoSellValidator({
        position,
        executionPrice,
        triggerData: trigger.triggerData,
        action: trigger.action,
        triggers,
        currentStopLoss,
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

      const currentAutoSell = triggers.triggers.sparkBasicSell
      const currentTrigger: CurrentTriggerLike | undefined = currentAutoSell
        ? {
            triggerData: currentAutoSell.triggerData as `0x${string}`,
            id: safeParseBigInt(currentAutoSell.triggerId) ?? 0n,
          }
        : undefined

      const encodedData = encodeSparkAutoSell(position, trigger.triggerData, currentTrigger)

      const triggerData =
        action === SupportedActions.Remove
          ? {
              encodedTriggerData: encodedData.encodedTriggerData,
              txData: encodedData.removeTrigger,
            }
          : {
              encodedTriggerData: encodedData.encodedTriggerData,
              txData: encodedData.upsertTrigger,
            }

      if (triggerData.txData === undefined) {
        throw new Error('txData is undefined')
      }

      const transaction = encodeFunctionForDpm(
        {
          dpm: trigger.dpm,
          triggerTxData: triggerData.txData,
        },
        addresses,
      )
      return {
        encodedTriggerData: triggerData.encodedTriggerData,
        transaction,
      }
    },
  } as ServiceContainer<SparkAutoSellEventBody>
}
