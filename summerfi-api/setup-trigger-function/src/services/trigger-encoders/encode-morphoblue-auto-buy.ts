import {
  bytesToHex,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  stringToBytes,
} from 'viem'
import { automationBotAbi } from '@summerfi/abis'
import { MorphoBlueAutoBuyTriggerData } from '~types'
import { maxUnit256, PositionLike, CurrentTriggerLike } from '@summerfi/triggers-shared'

import { DEFAULT_DEVIATION } from './defaults'
import { TriggerTransactions } from './types'
import { OPERATION_NAMES } from '@oasisdex/dma-library'
import { getMaxCoverage } from './get-max-coverage'

export const encodeMorphoBlueAutoBuy = (
  position: PositionLike,
  triggerData: MorphoBlueAutoBuyTriggerData,
  currentTrigger: CurrentTriggerLike | undefined,
): TriggerTransactions => {
  const abiParameters = parseAbiParameters(
    // CommonTriggerData
    'address positionAddress, ' +
      'uint16 triggerType, ' +
      'uint256 maxCoverage, ' +
      'address debtToken, ' +
      'address collateralToken, ' +
      'bytes32 operationName, ' +
      // Trigger specific data
      'bytes32 poolId, ' +
      'uint8 quoteDecimals, ' +
      'uint8 collateralDecimals, ' +
      'uint256 executionLtv, ' +
      'uint256 targetLTV, ' +
      'uint256 maxBuyPrice, ' +
      'uint64 deviation, ' +
      'uint32 maxBaseFeeInGwei',
  )

  /** @todo UPDATE OPERATION NAMES FOR MB */
  const operationName = OPERATION_NAMES.morphoblue.ADJUST_RISK_UP
  const operationNameInBytes = bytesToHex(stringToBytes(operationName, { size: 32 }))

  const maxCoverage = getMaxCoverage(position)

  const encodedTriggerData = encodeAbiParameters(abiParameters, [
    // CommonTriggerData
    position.address,
    triggerData.type,
    maxCoverage,
    position.debt.token.address,
    position.collateral.token.address,
    operationNameInBytes,
    // Trigger specific data
    triggerData.poolId,
    position.debt.token.decimals,
    position.collateral.token.decimals,
    triggerData.executionLTV,
    triggerData.targetLTV,
    triggerData.maxBuyPrice ?? maxUnit256,
    DEFAULT_DEVIATION, // 100 -> 1%
    triggerData.maxBaseFee,
  ])

  const encodedTrigger = encodeFunctionData({
    abi: automationBotAbi,
    functionName: 'addTriggers',
    args: [
      65535,
      [true],
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

  return {
    encodedTriggerData,
    upsertTrigger: encodedTrigger,
    removeTrigger,
  }
}
