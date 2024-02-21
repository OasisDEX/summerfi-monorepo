import { ServiceContainer } from './service-container'
import { AaveAutoBuyEventBody, SupportedActions } from '~types'
import { simulatePosition } from './simulate-position'
import { PublicClient } from 'viem'
import { Addresses } from './get-addresses'
import { Address, ChainId, safeParseBigInt } from '@summerfi/serverless-shared'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { Logger } from '@aws-lambda-powertools/logger'
import memoize from 'just-memoize'
import { getAavePosition } from './get-aave-position'
import { calculateCollateralPriceInDebtBasedOnLtv } from './calculate-collateral-price-in-debt-based-on-ltv'
import { autoBuyValidator } from './against-position-validators'
import { getUsdAaveOraclePrice } from './get-usd-aave-oracle-price'
import { CurrentTriggerLike, encodeAaveAutoBuy } from './trigger-encoders'
import { encodeFunctionForDpm } from './encode-function-for-dpm'
import { getCurrentStopLoss } from './get-current-stop-loss'

export interface GetAaveAutoBuyServiceContainerProps {
  rpc: PublicClient
  addresses: Addresses
  getTriggers: (address: Address) => Promise<GetTriggersResponse>
  logger?: Logger
  chainId: ChainId
}

export const getAaveAutoBuyServiceContainer: (
  params: GetAaveAutoBuyServiceContainerProps,
) => ServiceContainer<AaveAutoBuyEventBody> = ({
  rpc,
  addresses,
  getTriggers,
  logger,
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

      const currentStopLoss = getCurrentStopLoss(triggers, position, logger)

      return autoBuyValidator({
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

      const debtPriceInUSD = await getUsdAaveOraclePrice(trigger.position.debt, addresses, rpc)

      const currentAutoBuy = triggers.triggers.aaveBasicBuy
      const currentTrigger: CurrentTriggerLike | undefined = currentAutoBuy
        ? {
            triggerData: currentAutoBuy.triggerData as `0x${string}`,
            id: safeParseBigInt(currentAutoBuy.triggerId) ?? 0n,
          }
        : undefined

      const encodedData = encodeAaveAutoBuy(
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
  } as ServiceContainer<AaveAutoBuyEventBody>
}
