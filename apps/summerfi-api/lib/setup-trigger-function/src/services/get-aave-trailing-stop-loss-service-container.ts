import { ServiceContainer } from './service-container'
import { AaveTrailingStopLossEventBody, safeParseBigInt, SupportedActions } from '~types'
import { PublicClient } from 'viem'
import { Addresses } from './get-addresses'
import { Address, ChainId } from '@summerfi/serverless-shared'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { Logger } from '@aws-lambda-powertools/logger'
import memoize from 'just-memoize'
import { getAavePosition } from './get-aave-position'
import { encodeFunctionForDpm } from './encode-function-for-dpm'
import { encodeAaveTrailingStopLoss } from './trigger-encoders/encode-aave-trailing-stop-loss'
import { LatestPrice } from '@summerfi/prices-subgraph'
import { CurrentTriggerLike } from './trigger-encoders'

export interface GetAaveTrailingStopLossServiceContainerProps {
  rpc: PublicClient
  addresses: Addresses
  getTriggers: (address: Address) => Promise<GetTriggersResponse>
  getLatestPrice: (token: Address, denomination: Address) => Promise<LatestPrice | undefined>
  logger?: Logger
  chainId: ChainId
}

function getCurrentTrailingStopLoss(triggers: GetTriggersResponse): CurrentTriggerLike | undefined {
  const currentStopLoss = triggers.triggers.aaveTrailingStopLossDMA

  return currentStopLoss
    ? {
        triggerData: currentStopLoss.triggerData as `0x${string}`,
        id: safeParseBigInt(currentStopLoss.triggerId) ?? 0n,
      }
    : undefined
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

  return {
    simulatePosition: async ({ trigger }) => {
      const latestPrice = await getLatestPrice(trigger.position.collateral, trigger.position.debt)
      if (latestPrice === undefined) {
        throw new Error('latestPrice is undefined')
      }
      return latestPrice
    },
    validate: () => {
      return Promise.resolve({
        success: true,
        errors: [],
        warnings: [
          {
            message: 'VALIDATIONS ARE NOT IMPLEMENTED YET',
            code: 'warning-code',
            path: ['path'],
          },
        ],
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
      const currentTrigger: CurrentTriggerLike | undefined = getCurrentTrailingStopLoss(triggers)

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
