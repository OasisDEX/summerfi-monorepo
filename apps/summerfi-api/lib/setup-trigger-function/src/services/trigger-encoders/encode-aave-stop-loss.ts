import { EncoderFunction } from './types'
import {
  bytesToHex,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  stringToBytes,
} from 'viem'
import { OPERATION_NAMES } from '@oasisdex/dma-library'
import { MAX_COVERAGE_BASE } from './defaults'
import { automationBotAbi } from '~abi'
import { DmaAaveStopLossTriggerData } from '~types'

export const encodeAaveStopLoss: EncoderFunction<DmaAaveStopLossTriggerData> = (
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

  const operationName = OPERATION_NAMES.aave.v3.CLOSE_POSITION
  const operationNameInBytes = bytesToHex(stringToBytes(operationName, { size: 32 }))

  const encodedTriggerData = encodeAbiParameters(abiParameters, [
    position.address,
    triggerData.type,
    MAX_COVERAGE_BASE * 10n ** BigInt(position.debt.token.decimals),
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
