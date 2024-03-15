import { TriggerTransactions } from './types'
import {
  bytesToHex,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  stringToBytes,
} from 'viem'
import { OPERATION_NAMES } from '@oasisdex/dma-library'
import { DEFAULT_DEVIATION } from './defaults'
import { automationBotAbi } from '@summerfi/abis'
import { SparkAutoSellTriggerData } from '~types'
import { PositionLike, CurrentTriggerLike } from '@summerfi/triggers-shared'

import { getMaxCoverage } from './get-max-coverage'

export const encodeSparkAutoSell = (
  position: PositionLike,
  triggerData: SparkAutoSellTriggerData,
  currentTrigger: CurrentTriggerLike | undefined,
): TriggerTransactions => {
  const abiParameters = parseAbiParameters(
    'address positionAddress, ' +
      'uint16 triggerType, ' +
      'uint256 maxCoverage, ' +
      'address debtToken, ' +
      'address collateralToken, ' +
      'bytes32 operationName, ' +
      'uint256 executionLtv, ' +
      'uint256 targetLTV, ' +
      'uint256 minSellPrice, ' +
      'uint64 deviation, ' +
      'uint32 maxBaseFeeInGwei',
  )

  const operationName = OPERATION_NAMES.spark.ADJUST_RISK_DOWN
  const operationNameInBytes = bytesToHex(stringToBytes(operationName, { size: 32 }))

  const maxCoverage = getMaxCoverage(position)

  const encodedTriggerData = encodeAbiParameters(abiParameters, [
    position.address,
    triggerData.type,
    maxCoverage,
    position.debt.token.address,
    position.collateral.token.address,
    operationNameInBytes,
    triggerData.executionLTV,
    triggerData.targetLTV,
    triggerData.minSellPrice ?? 0n,
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
