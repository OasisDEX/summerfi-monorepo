import { ServiceContainer } from './service-container'
import { SparkStopLossEventBody, SupportedActions } from '~types'
import { PublicClient } from 'viem'
import { Addresses } from './get-addresses'
import { Address, ChainId, safeParseBigInt } from '@summerfi/serverless-shared'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { Logger } from '@aws-lambda-powertools/logger'
import memoize from 'just-memoize'
import { calculateCollateralPriceInDebtBasedOnLtv } from './calculate-collateral-price-in-debt-based-on-ltv'
import { dmaSparkStopLossValidator } from './against-position-validators'
import { CurrentTriggerLike, encodeSparkStopLoss } from './trigger-encoders'
import { encodeFunctionForDpm } from './encode-function-for-dpm'
import { getSparkPosition } from './get-spark-position'

export interface GetSparkStopLossServiceContainerProps {
  rpc: PublicClient
  addresses: Addresses
  getTriggers: (address: Address) => Promise<GetTriggersResponse>
  logger?: Logger
  chainId: ChainId
}

function getCurrentStopLoss(triggers: GetTriggersResponse): CurrentTriggerLike | undefined {
  const currentStopLoss = triggers.triggerGroup.sparkStopLoss

  return currentStopLoss
    ? {
        triggerData: currentStopLoss.triggerData as `0x${string}`,
        id: safeParseBigInt(currentStopLoss.triggerId) ?? 0n,
      }
    : undefined
}

export const getSparkStopLossServiceContainer: (
  props: GetSparkStopLossServiceContainerProps,
) => ServiceContainer<SparkStopLossEventBody> = ({ rpc, addresses, logger, getTriggers }) => {
  const getPosition = memoize(async (params: Parameters<typeof getSparkPosition>[0]) => {
    return await getSparkPosition(params, rpc, addresses, logger)
  })

  return {
    simulatePosition: () => {
      return Promise.resolve({})
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
      return dmaSparkStopLossValidator({
        position,
        executionPrice,
        triggerData: trigger.triggerData,
        action: trigger.action,
        triggers,
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

      const currentTrigger: CurrentTriggerLike | undefined = getCurrentStopLoss(triggers)

      const encodedData = encodeSparkStopLoss(position, trigger.triggerData, currentTrigger)

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
  } as ServiceContainer<SparkStopLossEventBody>
}
