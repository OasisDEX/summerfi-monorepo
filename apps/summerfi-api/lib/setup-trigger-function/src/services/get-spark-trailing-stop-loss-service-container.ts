import { ServiceContainer } from './service-container'
import { maxUnit256, SparkTrailingStopLossEventBody, SupportedActions } from '~types'
import { PublicClient } from 'viem'
import { Addresses } from './get-addresses'
import { Address, ChainId } from '@summerfi/serverless-shared'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { Logger } from '@aws-lambda-powertools/logger'
import memoize from 'just-memoize'
import { encodeFunctionForDpm } from './encode-function-for-dpm'
import { DerivedPrices } from '@summerfi/prices-subgraph'
import { CurrentTriggerLike } from './trigger-encoders'
import { calculateCollateralPriceInDebtBasedOnLtv } from './calculate-collateral-price-in-debt-based-on-ltv'
import { calculateLtv } from './calculate-ltv'
import { getSparkPosition } from './get-spark-position'
import { dmaSparkTrailingStopLossValidator } from './against-position-validators/dma-spark-trailing-stop-loss-validator'
import { getCurrentSparkStopLoss } from './get-current-spark-stop-loss'
import { encodeSparkTrailingStopLoss } from './trigger-encoders/encode-spark-trailing-stop-loss'

export interface GetSparkTrailingStopLossServiceContainerProps {
  rpc: PublicClient
  addresses: Addresses
  getTriggers: (address: Address) => Promise<GetTriggersResponse>
  getLatestPrice: (token: Address, denomination: Address) => Promise<DerivedPrices | undefined>
  logger?: Logger
  chainId: ChainId
}

export const getSparkTrailingStopLossServiceContainer: (
  props: GetSparkTrailingStopLossServiceContainerProps,
) => ServiceContainer<SparkTrailingStopLossEventBody> = ({
  rpc,
  addresses,
  logger,
  getTriggers,
  getLatestPrice,
}) => {
  const getPosition = memoize(async (params: Parameters<typeof getSparkPosition>[0]) => {
    return await getSparkPosition(params, rpc, addresses, logger)
  })

  const getExecutionParams = memoize(
    async ({ trigger }: { trigger: SparkTrailingStopLossEventBody }) => {
      const latestPrice = await getLatestPrice(trigger.position.collateral, trigger.position.debt)

      const position = await getPosition({
        address: trigger.dpm,
        collateral: trigger.position.collateral,
        debt: trigger.position.debt,
      })

      const derivedPrice = BigInt(latestPrice?.derivedPrice ?? maxUnit256) // if latestPrice is undefined, it won't pass later validation

      const dynamicCollateralPrice = derivedPrice - trigger.triggerData.trailingDistance

      const dynamicExecutionLTV = calculateLtv({
        collateral: position.collateral,
        debt: position.debt,
        collateralPriceInDebt: dynamicCollateralPrice,
      })

      const executionPrice = calculateCollateralPriceInDebtBasedOnLtv({
        ...position,
        ltv: dynamicExecutionLTV,
      })

      return {
        executionPrice,
        dynamicExecutionLTV,
      }
    },
    (params) => `${params.trigger.dpm}-${params.trigger.triggerData.type}`,
  )

  return {
    simulatePosition: async ({ trigger }) => {
      const latestPrice = await getLatestPrice(trigger.position.collateral, trigger.position.debt)
      const position = await getPosition({
        address: trigger.dpm,
        collateral: trigger.position.collateral,
        debt: trigger.position.debt,
      })
      const executionParams = await getExecutionParams({ trigger })
      return {
        latestPrice,
        position,
        executionParams,
      }
    },
    validate: async ({ trigger }) => {
      const latestPrice = await getLatestPrice(trigger.position.collateral, trigger.position.debt)

      const position = await getPosition({
        address: trigger.dpm,
        collateral: trigger.position.collateral,
        debt: trigger.position.debt,
      })

      const triggers = await getTriggers(trigger.dpm)

      const { executionPrice, dynamicExecutionLTV } = await getExecutionParams({ trigger })

      return dmaSparkTrailingStopLossValidator({
        position: position,
        executionPrice: executionPrice,
        dynamicExecutionLTV: dynamicExecutionLTV,
        triggerData: trigger.triggerData,
        triggers: triggers,
        latestPrice: latestPrice,
        action: trigger.action,
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

      const latestPrice = await getLatestPrice(trigger.position.collateral, trigger.position.debt)

      if (latestPrice === undefined) {
        throw new Error('latestPrice is undefined')
      }

      const encodedData = encodeSparkTrailingStopLoss(
        position,
        trigger.triggerData,
        latestPrice,
        currentTrigger,
      )

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
  } as ServiceContainer<SparkTrailingStopLossEventBody>
}
