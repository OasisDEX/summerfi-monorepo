import { ServiceContainer } from './service-container'
import { SparkStopLossEventBody } from '~types'
import { PublicClient } from 'viem'
import { Addresses, CurrentTriggerLike } from '@summerfi/triggers-shared'
import { Address, ChainId } from '@summerfi/serverless-shared'
import { GetTriggersResponse } from '@summerfi/triggers-shared/contracts'
import { Logger } from '@aws-lambda-powertools/logger'
import memoize from 'just-memoize'
import { dmaSparkStopLossValidator } from './against-position-validators'
import { encodeSparkStopLoss } from './trigger-encoders'
import { encodeFunctionForDpm } from './encode-function-for-dpm'
import { getCurrentSparkStopLoss } from '@summerfi/triggers-calculations'
import {
  calculateCollateralPriceInDebtBasedOnLtv,
  getSparkPosition,
} from '@summerfi/triggers-calculations'
import { SupportedActions } from '@summerfi/triggers-shared'

export interface GetSparkStopLossServiceContainerProps {
  rpc: PublicClient
  addresses: Addresses
  getTriggers: (address: Address) => Promise<GetTriggersResponse>
  logger?: Logger
  chainId: ChainId
}

export const getSparkStopLossServiceContainer: (
  props: GetSparkStopLossServiceContainerProps,
) => ServiceContainer<SparkStopLossEventBody> = ({ rpc, addresses, logger, getTriggers }) => {
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

      const currentTrigger: CurrentTriggerLike | undefined = getCurrentSparkStopLoss(
        triggers,
        position,
        logger,
      )

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
