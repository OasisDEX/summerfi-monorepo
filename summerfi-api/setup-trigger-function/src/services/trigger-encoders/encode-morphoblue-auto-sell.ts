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
import { MorphoBlueAutoSellTriggerData } from '~types'
import { CurrentTriggerLike, PositionLike } from '@summerfi/triggers-shared'

import { getMaxCoverage } from './get-max-coverage'
import { getMorphoOraclePriceConverted } from './get-morpho-oracle-price-converted'

export const encodeMorphoBlueAutoSell = (
  position: PositionLike,
  triggerData: MorphoBlueAutoSellTriggerData,
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
      'uint256 executionLtv, ' +
      'uint256 targetLTV, ' +
      'uint256 minSellPrice, ' +
      'uint64 deviation, ' +
      'uint32 maxBaseFeeInGwei',
  )

  const operationName = OPERATION_NAMES.morphoblue.ADJUST_RISK_DOWN
  const operationNameInBytes = bytesToHex(stringToBytes(operationName, { size: 32 }))

  const maxCoverage = getMaxCoverage(position)

  const resolvedMinSellPrice = triggerData.minSellPrice
    ? getMorphoOraclePriceConverted({
        price: triggerData.minSellPrice,
        debtDecimals: position.debt.token.decimals,
        collateralDecimals: position.collateral.token.decimals,
      })
    : 0n

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
    triggerData.executionLTV,
    triggerData.targetLTV,
    resolvedMinSellPrice,
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
