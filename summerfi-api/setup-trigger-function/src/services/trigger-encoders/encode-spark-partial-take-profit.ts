import { bytesToHex, encodeAbiParameters, parseAbiParameters, stringToBytes } from 'viem'
import { SparkPartialTakeProfitTriggerData } from '~types'
import { PositionLike } from '@summerfi/triggers-shared'
import { DEFAULT_DEVIATION } from './defaults'
import { CurrentTriggerLike, EncodedTriggers } from './types'
import { OPERATION_NAMES } from '@oasisdex/dma-library'
import { getMaxCoverage } from './get-max-coverage'
import { AddableTrigger, RemovableTrigger } from './automation-bot-helper'

export const encodeSparkPartialTakeProfit = (
  position: PositionLike,
  triggerData: SparkPartialTakeProfitTriggerData,
  currentTrigger: CurrentTriggerLike | undefined,
): EncodedTriggers => {
  const abiParameters = parseAbiParameters(
    'address positionAddress, uint16 triggerType, uint256 maxCoverage, address debtToken, ' +
      'address collateralToken, bytes32 operationName, uint256 executionLtv, uint256 targetLtv, ' +
      'uint256 excutionPrice, uint64 deviation, bool withdrawToDebt',
  )

  const operationName =
    triggerData.withdrawToken === position.debt.token.address
      ? OPERATION_NAMES.spark.WITHDRAW_TO_DEBT
      : OPERATION_NAMES.spark.WITHDRAW

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
