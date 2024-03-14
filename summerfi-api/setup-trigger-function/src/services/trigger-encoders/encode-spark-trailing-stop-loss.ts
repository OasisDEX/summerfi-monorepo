import { CurrentTriggerLike, EncodedTriggers, TriggerTransactions } from './types'
import {
  bytesToHex,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  stringToBytes,
} from 'viem'
import { automationBotAbi } from '@summerfi/abis'
import { DmaSparkTrailingStopLossTriggerData } from '~types'
import { PositionLike } from '@summerfi/triggers-shared'

import { DerivedPrices } from '@summerfi/prices-subgraph'
import { getMaxCoverage } from './get-max-coverage'
import { OPERATION_NAMES } from '@oasisdex/dma-library'
import { AddableTrigger, RemovableTrigger } from './automation-bot-helper'

export const encodeSparkTrailingStopLoss = (
  position: PositionLike,
  triggerData: DmaSparkTrailingStopLossTriggerData,
  latestPrice: DerivedPrices,
  currentTrigger: CurrentTriggerLike | undefined,
): TriggerTransactions & EncodedTriggers => {
  const abiParameters = parseAbiParameters(
    'address positionAddress, ' +
      'uint16 triggerType, ' +
      'uint256 maxCoverage, ' +
      'address debtToken, ' +
      'address collateralToken, ' +
      'bytes32 operationName, ' +
      'address collateralOracle, ' +
      'uint80 collateralAddedRoundId, ' +
      'address debtOracle, ' +
      'uint80 debtAddedRoundId, ' +
      'uint256 trailingDistance, ' +
      'bool closeToCollateral',
  )

  const operationName =
    triggerData.token === position.collateral.token.address
      ? OPERATION_NAMES.spark.CLOSE_AND_REMAIN
      : OPERATION_NAMES.spark.CLOSE_AND_EXIT

  const operationNameInBytes = bytesToHex(stringToBytes(operationName, { size: 32 }))

  const maxCoverage = getMaxCoverage(position)

  const encodedTriggerData = encodeAbiParameters(abiParameters, [
    position.address,
    triggerData.type,
    maxCoverage,
    position.debt.token.address,
    position.collateral.token.address,
    operationNameInBytes,
    latestPrice.token.oraclesToken[0].address ?? '0x0',
    latestPrice.tokenRoundId,
    latestPrice.denomination.oraclesToken[0].address ?? '0x0',
    latestPrice.denominationRoundId,
    triggerData.trailingDistance,
    triggerData.token === position.collateral.token.address,
  ])

  const encodedTrigger = encodeFunctionData({
    abi: automationBotAbi,
    functionName: 'addTriggers',
    args: [
      65535,
      [false],
      [currentTrigger?.id ?? 0n],
      [encodedTriggerData],
      [currentTrigger?.triggerData ?? '0x0'],
      [triggerData.type],
    ],
  })

  const removeTrigger = currentTrigger
    ? encodeFunctionData({
        abi: automationBotAbi,
        functionName: 'removeTriggers',
        args: [
          [currentTrigger.id],
          [currentTrigger.triggerData],
          currentTrigger.triggersOnAccount === 1, // remove allowance only if it's the last trigger
        ],
      })
    : undefined

  const addableTrigger: AddableTrigger = {
    continuous: true,
    currentId: currentTrigger?.id ?? 0n,
    encodedTriggerData: encodedTriggerData,
    currentTriggerData: currentTrigger?.triggerData ?? '0x0',
    triggerType: triggerData.type,
  }

  const removableTrigger: RemovableTrigger | undefined = currentTrigger
    ? {
        currentId: currentTrigger.id,
        currentData: currentTrigger.triggerData,
      }
    : undefined

  return {
    encodedTriggerData,
    upsertTrigger: encodedTrigger,
    removeTrigger,
    addableTrigger,
    removableTrigger,
  }
}
