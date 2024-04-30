import { ServiceContainer } from './service-container'
import { MorphoBlueAutoBuyEventBody } from '~types'
import { simulatePosition } from './simulate-position'
import { PublicClient } from 'viem'
import { Addresses, CurrentTriggerLike } from '@summerfi/triggers-shared'
import { Address, ChainId, PoolId, ProtocolId, safeParseBigInt } from '@summerfi/serverless-shared'
import { GetTriggersResponse } from '@summerfi/triggers-shared/contracts'
import { Logger } from '@aws-lambda-powertools/logger'
import memoize from 'just-memoize'
import { encodeMorphoBlueAutoBuy } from './trigger-encoders'
import { encodeFunctionForDpm } from './encode-function-for-dpm'
import { getCurrentMorphoBlueStopLoss } from '@summerfi/triggers-calculations'
import {
  getMorphoBluePosition,
  calculateCollateralPriceInDebtBasedOnLtv,
} from '@summerfi/triggers-calculations'
import { SupportedActions } from '@summerfi/triggers-shared'
import { morphoBlueAutoBuyValidator } from './against-position-validators'

export interface GetMorphoBlueAutoBuyServiceContainerProps {
  rpc: PublicClient
  addresses: Addresses
  getTriggers: (address: Address, poolId: PoolId) => Promise<GetTriggersResponse>
  logger?: Logger
  chainId: ChainId
}

export const getMorphoBlueAutoBuyServiceContainer: (
  params: GetMorphoBlueAutoBuyServiceContainerProps,
) => ServiceContainer<MorphoBlueAutoBuyEventBody> = ({
  rpc,
  addresses,
  getTriggers,
  logger,
  chainId,
}) => {
  const getPosition = memoize(async (params: Parameters<typeof getMorphoBluePosition>[0]) => {
    return await getMorphoBluePosition(
      params,
      rpc,
      {
        morphoBlue: addresses.MorphoBlue.MorphoBlue,
      },
      logger,
    )
  })

  return {
    simulatePosition: async ({ trigger }) => {
      const position = await getPosition({
        address: trigger.dpm,
        poolId: trigger.triggerData.poolId,
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
        poolId: trigger.triggerData.poolId,
        collateral: trigger.position.collateral,
        debt: trigger.position.debt,
      })

      const executionPrice = calculateCollateralPriceInDebtBasedOnLtv({
        ...position,
        ltv: trigger.triggerData.executionLTV,
      })

      const triggers = await getTriggers(trigger.dpm, trigger.triggerData.poolId)

      const currentStopLoss = getCurrentMorphoBlueStopLoss(triggers, position, logger)

      return morphoBlueAutoBuyValidator({
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
      const triggers = await getTriggers(trigger.dpm, trigger.triggerData.poolId)
      const position = await getPosition({
        address: trigger.dpm,
        poolId: trigger.triggerData.poolId,
        collateral: trigger.position.collateral,
        debt: trigger.position.debt,
      })

      const currentAutoBuy =
        triggers.triggers[ProtocolId.MORPHO_BLUE][trigger.triggerData.poolId].morphoBlueBasicBuy
      const currentTrigger: CurrentTriggerLike | undefined = currentAutoBuy
        ? {
            triggerData: currentAutoBuy.triggerData as `0x${string}`,
            id: safeParseBigInt(currentAutoBuy.triggerId) ?? 0n,
            triggersOnAccount: triggers.triggersCount,
          }
        : undefined

      const encodedData = encodeMorphoBlueAutoBuy(position, trigger.triggerData, currentTrigger)

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
  } as ServiceContainer<MorphoBlueAutoBuyEventBody>
}
