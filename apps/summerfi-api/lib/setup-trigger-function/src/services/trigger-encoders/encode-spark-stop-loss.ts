import { EncoderFunction } from './types'
import {
  bytesToHex,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  stringToBytes,
} from 'viem'
import { automationBotAbi } from '~abi'
import { DmaAaveStopLossTriggerData } from '~types'
import { TriggerType } from '@oasisdex/automation'
import { getMaxCoverage } from './get-max-coverage'

export const encodeSparkStopLoss: EncoderFunction<DmaAaveStopLossTriggerData> = (
  position,
  triggerData,
  debtPriceInUSD,
  currentTrigger,
) => {
  const abiParameters = parseAbiParameters(
    'address positionAddress, ' +
      'uint16 triggerType, ' +
      'uint256 maxCoverage, ' +
      'address debtToken, ' +
      'address collateralToken, ' +
      'bytes32 operationName, ' +
      'uint256 executionLtv',
  )

  const operationName =
    triggerData.type == BigInt(TriggerType.DmaSparkStopLossToCollateralV2)
      ? 'CloseAndRemainSparkPosition'
      : triggerData.type == BigInt(TriggerType.DmaSparkStopLossToDebtV2)
        ? 'SparkClosePosition'
        : undefined

  if (operationName === undefined) {
    throw new Error('Invalid trigger type')
  }

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
        args: [[currentTrigger.id], [currentTrigger.triggerData], true],
      })
    : undefined

  return {
    encodedTriggerData,
    upsertTrigger: encodedTrigger,
    removeTrigger,
  }
}
