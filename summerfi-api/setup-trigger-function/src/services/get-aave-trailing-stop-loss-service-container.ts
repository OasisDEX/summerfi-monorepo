import { ServiceContainer } from './service-container'
import { AaveTrailingStopLossEventBody, maxUnit256, SupportedActions } from '~types'
import { PublicClient } from 'viem'
import { Addresses } from './get-addresses'
import { Address, ChainId } from '@summerfi/serverless-shared'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { Logger } from '@aws-lambda-powertools/logger'
import memoize from 'just-memoize'
import { getAavePosition } from './get-aave-position'
import { encodeFunctionForDpm } from './encode-function-for-dpm'
import { encodeAaveTrailingStopLoss } from './trigger-encoders'
import { DerivedPrices } from '@summerfi/prices-subgraph'
import { CurrentTriggerLike } from './trigger-encoders'
import { dmaAaveTrailingStopLossValidator } from './against-position-validators'
import { calculateCollateralPriceInDebtBasedOnLtv, calculateLtv } from '~helpers'
import { getCurrentAaveStopLoss } from './get-current-aave-stop-loss'

export interface GetAaveTrailingStopLossServiceContainerProps {
  rpc: PublicClient
  addresses: Addresses
  getTriggers: (address: Address) => Promise<GetTriggersResponse>
  getLatestPrice: (token: Address, denomination: Address) => Promise<DerivedPrices | undefined>
  logger?: Logger
  chainId: ChainId
}

export const getAaveTrailingStopLossServiceContainer: (
  props: GetAaveTrailingStopLossServiceContainerProps,
) => ServiceContainer<AaveTrailingStopLossEventBody> = ({
  rpc,
  addresses,
  logger,
  getTriggers,
  getLatestPrice,
}) => {
  const getPosition = memoize(async (params: Parameters<typeof getAavePosition>[0]) => {
    return await getAavePosition(params, rpc, addresses, logger)
  })

  const getExecutionParams = memoize(
    async ({ trigger }: { trigger: AaveTrailingStopLossEventBody }) => {
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

      return dmaAaveTrailingStopLossValidator({
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
      const currentTrigger: CurrentTriggerLike | undefined = getCurrentAaveStopLoss(
        triggers,
        position,
        logger,
      )

      const latestPrice = await getLatestPrice(trigger.position.collateral, trigger.position.debt)

      if (latestPrice === undefined) {
        throw new Error('latestPrice is undefined')
      }

      const encodedData = encodeAaveTrailingStopLoss(
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
  } as ServiceContainer<AaveTrailingStopLossEventBody>
}
