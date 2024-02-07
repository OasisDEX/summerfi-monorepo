import { ServiceContainer } from './service-container'
import { StopLossEventBody, safeParseBigInt, SupportedActions } from '~types'
import { PublicClient } from 'viem'
import { Addresses } from './get-addresses'
import { Address, ChainId } from '@summerfi/serverless-shared'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { Logger } from '@aws-lambda-powertools/logger'
import memoize from 'just-memoize'
import { getAavePosition } from './get-aave-position'
import { calculateCollateralPriceInDebtBasedOnLtv } from './calculate-collateral-price-in-debt-based-on-ltv'
import { stopLossValidator } from './against-position-validators'
import { getUsdAaveOraclePrice } from './get-usd-aave-oracle-price'
import { CurrentTriggerLike, encodeAaveStopLoss } from './trigger-encoders'
import { encodeFunctionForDpm } from './encode-function-for-dpm'

export interface GetAaveStopLossServiceContainerProps {
  rpc: PublicClient
  addresses: Addresses
  getTriggers: (address: Address) => Promise<GetTriggersResponse>
  logger?: Logger
  chainId: ChainId
}

function getCurrentStopLoss(triggers: GetTriggersResponse): CurrentTriggerLike | undefined {
  const currentStopLoss =
    triggers.triggers.aaveStopLossToCollateral ??
    triggers.triggers.aaveStopLossToCollateralDMA ??
    triggers.triggers.aaveStopLossToDebt ??
    triggers.triggers.aaveStopLossToDebtDMA

  return currentStopLoss
    ? {
        triggerData: currentStopLoss.triggerData as `0x${string}`,
        id: safeParseBigInt(currentStopLoss.triggerId) ?? 0n,
      }
    : undefined
}

export const getAaveStopLossServiceContainer: (
  props: GetAaveStopLossServiceContainerProps,
) => ServiceContainer<StopLossEventBody> = ({ rpc, addresses, logger, getTriggers, chainId }) => {
  const getPosition = memoize(async (params: Parameters<typeof getAavePosition>[0]) => {
    return await getAavePosition(params, rpc, addresses, logger)
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
      return stopLossValidator({
        position,
        executionPrice,
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

      const debtPriceInUSD = await getUsdAaveOraclePrice(trigger.position.debt, addresses, rpc)

      const currentTrigger: CurrentTriggerLike | undefined = getCurrentStopLoss(triggers)

      const encodedData = encodeAaveStopLoss(
        position,
        trigger.triggerData,
        debtPriceInUSD,
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
  } as ServiceContainer<StopLossEventBody>
}
