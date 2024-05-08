import {
  MorphoBluePartialTakeProfit,
  MorphoBluePartialTakeProfitID,
  Trigger,
} from '@summerfi/triggers-shared/contracts'
import { TriggersQuery } from '@summerfi/automation-subgraph'
import { Logger } from '@aws-lambda-powertools/logger'
import { mapTriggerCommonParams } from '../helpers'
import {
  simulateAutoTakeProfit,
  getCurrentMorphoBlueStopLoss,
  getMorphoBluePosition,
} from '@summerfi/triggers-calculations'
import { Address, PoolId, safeParseBigInt } from '@summerfi/serverless-shared'
import { PublicClient } from 'viem'
import { Addresses } from '@summerfi/triggers-shared'

export const getMorphoBluePartialTakeProfit = async ({
  triggers,
  logger,
  publicClient,
  getDetails,
  addresses,
  stopLoss,
}: {
  triggers: TriggersQuery
  logger: Logger
  publicClient: PublicClient
  getDetails: boolean
  addresses: Addresses
  stopLoss?: Trigger
}): Promise<MorphoBluePartialTakeProfit | undefined> => {
  const trigger = triggers.triggers.find(
    (trigger) => trigger.triggerType == MorphoBluePartialTakeProfitID,
  )

  if (!trigger) {
    return undefined
  }

  const parsedTrigger = {
    triggerTypeName: 'MorphoBluePartialTakeProfit' as const,
    triggerType: MorphoBluePartialTakeProfitID,
    ...mapTriggerCommonParams(trigger),
    decodedParams: {
      triggerType: trigger.decodedData[trigger.decodedDataNames.indexOf('triggerType')],
      positionAddress: trigger.decodedData[trigger.decodedDataNames.indexOf('positionAddress')],
      maxCoverage: trigger.decodedData[trigger.decodedDataNames.indexOf('maxCoverage')],
      debtToken: trigger.decodedData[trigger.decodedDataNames.indexOf('debtToken')],
      collateralToken: trigger.decodedData[trigger.decodedDataNames.indexOf('collateralToken')],
      operationName: trigger.decodedData[trigger.decodedDataNames.indexOf('operationName')],
      withdrawToDebt: trigger.decodedData[trigger.decodedDataNames.indexOf('withdrawToDebt')],
      executionLtv: trigger.decodedData[trigger.decodedDataNames.indexOf('executionLtv')],
      targetLtv: trigger.decodedData[trigger.decodedDataNames.indexOf('targetLtv')],
      deviation: trigger.decodedData[trigger.decodedDataNames.indexOf('deviation')],
      poolId: trigger.decodedData[trigger.decodedDataNames.indexOf('poolId')],
      executionPrice: trigger.decodedData[trigger.decodedDataNames.indexOf('executionPrice')],
    },
  }

  if (getDetails) {
    const position = await getMorphoBluePosition(
      {
        address: parsedTrigger.decodedParams.positionAddress as Address,
        collateral: parsedTrigger.decodedParams.collateralToken as Address,
        debt: parsedTrigger.decodedParams.debtToken as Address,
        poolId: parsedTrigger.decodedParams.poolId as PoolId,
      },
      publicClient,
      {
        morphoBlue: addresses.MorphoBlue.MorphoBlue,
      },
      logger,
    )

    const executionLTV = safeParseBigInt(parsedTrigger.decodedParams.executionLtv) ?? 0n
    const targetLTV = safeParseBigInt(parsedTrigger.decodedParams.targetLtv) ?? 0n
    const step = targetLTV - executionLTV
    const withdrawToken =
      parsedTrigger.decodedParams.withdrawToDebt === 'true'
        ? parsedTrigger.decodedParams.debtToken
        : parsedTrigger.decodedParams.collateralToken

    const currentStopLoss = getCurrentMorphoBlueStopLoss(
      { triggerGroup: { morphoBlueStopLoss: stopLoss }, triggersCount: 0 },
      position,
      logger,
    )

    const simulation = simulateAutoTakeProfit({
      position,
      minimalTriggerData: {
        executionPrice: safeParseBigInt(parsedTrigger.decodedParams.executionPrice) ?? 0n,
        executionLTV: safeParseBigInt(parsedTrigger.decodedParams.executionLtv) ?? 0n,
        withdrawStep: step,
        withdrawToken: withdrawToken as Address,
      },
      logger: logger,
      iterations: 1,
      currentStopLoss: currentStopLoss,
    })

    return {
      ...parsedTrigger,
      dynamicParams: {
        nextProfit: simulation.profits[0],
      },
    }
  }

  return parsedTrigger
}
