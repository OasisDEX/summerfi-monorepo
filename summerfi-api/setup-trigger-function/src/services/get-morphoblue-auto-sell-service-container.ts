import { ServiceContainer } from './service-container'
import { MorphoBlueAutoSellEventBody } from '~types'
import { PublicClient } from 'viem'
import { Addresses, CurrentTriggerLike } from '@summerfi/triggers-shared'
import { Address, ChainId, ProtocolId, safeParseBigInt } from '@summerfi/serverless-shared'
import { GetTriggersResponse } from '@summerfi/triggers-shared/contracts'
import { Logger } from '@aws-lambda-powertools/logger'
import memoize from 'just-memoize'
import { simulatePosition } from './simulate-position'
import { morphoBlueAutoSellValidator } from './against-position-validators'
import { encodeMorphoBlueAutoSell } from './trigger-encoders'
import { encodeFunctionForDpm } from './encode-function-for-dpm'
import { getCurrentMorphoBlueStopLoss } from '@summerfi/triggers-calculations'
import {
  calculateCollateralPriceInDebtBasedOnLtv,
  getMorphoBluePosition,
} from '@summerfi/triggers-calculations'
import { SupportedActions } from '@summerfi/triggers-shared'

export interface GetMorphoBlueAutoSellServiceContainerProps {
  rpc: PublicClient
  addresses: Addresses
  getTriggers: (address: Address) => Promise<GetTriggersResponse>
  logger?: Logger
  chainId: ChainId
}

export const getMorphoBlueAutoSellServiceContainer: (
  props: GetMorphoBlueAutoSellServiceContainerProps,
) => ServiceContainer<MorphoBlueAutoSellEventBody> = ({
  rpc,
  addresses,
  logger,
  getTriggers,
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
        poolId: trigger.poolId,
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
        poolId: trigger.poolId,
        collateral: trigger.position.collateral,
        debt: trigger.position.debt,
      })

      const executionPrice = calculateCollateralPriceInDebtBasedOnLtv({
        ...position,
        ltv: trigger.triggerData.executionLTV,
      })

      const triggers = await getTriggers(trigger.dpm)

      const currentStopLoss = getCurrentMorphoBlueStopLoss(triggers, position, logger)

      return morphoBlueAutoSellValidator({
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
        poolId: trigger.poolId,
        collateral: trigger.position.collateral,
        debt: trigger.position.debt,
      })

      const currentAutoSell = triggers.triggers[ProtocolId.MORPHO_BLUE][trigger.poolId].basicSell
      const currentTrigger: CurrentTriggerLike | undefined = currentAutoSell
        ? {
            triggerData: currentAutoSell.triggerData as `0x${string}`,
            id: safeParseBigInt(currentAutoSell.triggerId) ?? 0n,
            triggersOnAccount: triggers.triggersCount,
          }
        : undefined

      const encodedData = encodeMorphoBlueAutoSell(position, trigger.triggerData, currentTrigger)

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
  } as ServiceContainer<MorphoBlueAutoSellEventBody>
}
