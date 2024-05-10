import { bytesToHex, encodeAbiParameters, parseAbiParameters, stringToBytes } from 'viem'
import { MorphoBluePartialTakeProfitTriggerData } from '~types'
import { PositionLike, CurrentTriggerLike } from '@summerfi/triggers-shared'
import { DEFAULT_DEVIATION } from './defaults'
import { EncodedTriggers } from './types'
import { OPERATION_NAMES } from '@oasisdex/dma-library'
import { getMaxCoverage } from './get-max-coverage'
import { AddableTrigger, RemovableTrigger } from './automation-bot-helper'

export const encodeMorphoBluePartialTakeProfit = (
  position: PositionLike,
  triggerData: MorphoBluePartialTakeProfitTriggerData,
  currentTrigger: CurrentTriggerLike | undefined,
): EncodedTriggers => {
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
      'uint256 targetLtv, ' +
      'uint256 excutionPrice, ' +
      'uint64 deviation, ' +
      'bool withdrawToDebt',
  )

  const operationName =
    triggerData.withdrawToken === position.debt.token.address
      ? OPERATION_NAMES.morphoblue.WITHDRAW_TO_DEBT
      : OPERATION_NAMES.morphoblue.WITHDRAW

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
    triggerData.executionLTV + triggerData.withdrawStep,
    triggerData.executionPrice,
    DEFAULT_DEVIATION, // 100 -> 1%
    triggerData.withdrawToken === position.debt.token.address,
  ])

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
    addableTrigger,
    removableTrigger,
  }
}
