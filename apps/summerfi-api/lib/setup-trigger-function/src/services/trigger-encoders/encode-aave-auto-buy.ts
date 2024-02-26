import {
  bytesToHex,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  stringToBytes,
} from 'viem'
import { automationBotAbi } from '~abi'
import { AaveAutoBuyTriggerData, maxUnit256, PositionLike } from '~types'
import { DEFAULT_DEVIATION } from './defaults'
import { CurrentTriggerLike, TriggerTransactions } from './types'
import { OPERATION_NAMES } from '@oasisdex/dma-library'
import { getMaxCoverage } from './get-max-coverage'

export const encodeAaveAutoBuy = (
  position: PositionLike,
  triggerData: AaveAutoBuyTriggerData,
  currentTrigger: CurrentTriggerLike | undefined,
): TriggerTransactions => {
  const abiParameters = parseAbiParameters(
    'address positionAddress, uint16 triggerType, uint256 maxCoverage, address debtToken, ' +
      'address collateralToken, bytes32 operationName, uint256 executionLtv, uint256 targetLTV, ' +
      'uint256 maxBuyPrice, uint64 deviation, uint32 maxBaseFeeInGwei',
  )

  const operationName = OPERATION_NAMES.aave.v3.ADJUST_RISK_UP
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
        args: [[currentTrigger.id], [currentTrigger.triggerData], true],
      })
    : undefined

  return {
    encodedTriggerData,
    upsertTrigger: encodedTrigger,
    removeTrigger,
  }
}
