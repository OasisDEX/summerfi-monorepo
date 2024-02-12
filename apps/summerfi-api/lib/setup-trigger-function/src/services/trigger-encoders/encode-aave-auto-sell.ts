import { EncoderFunction } from './types'
import {
  bytesToHex,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  stringToBytes,
} from 'viem'
import { OPERATION_NAMES } from '@oasisdex/dma-library'
import { DEFAULT_DEVIATION, MAX_COVERAGE_BASE } from './defaults'
import { automationBotAbi } from '~abi'
import { AaveAutoSellTriggerData, PRICE_DECIMALS } from '~types'

export const encodeAaveAutoSell: EncoderFunction<AaveAutoSellTriggerData> = (
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
      'uint256 executionLtv, ' +
      'uint256 targetLTV, ' +
      'uint256 minSellPrice, ' +
      'uint64 deviation, ' +
      'uint32 maxBaseFeeInGwei',
  )

  const operationName = OPERATION_NAMES.aave.v3.ADJUST_RISK_DOWN
  const operationNameInBytes = bytesToHex(stringToBytes(operationName, { size: 32 }))

  const maxCoverageInPriceDecimals = MAX_COVERAGE_BASE * debtPriceInUSD

  const coverageShift = BigInt(position.debt.token.decimals) - PRICE_DECIMALS

  const maxCoverage =
    coverageShift >= 0n
      ? maxCoverageInPriceDecimals * 10n ** coverageShift
      : maxCoverageInPriceDecimals / 10n ** -coverageShift

  const encodedTriggerData = encodeAbiParameters(abiParameters, [
    position.address,
    triggerData.type,
    maxCoverage,
    position.debt.token.address,
    position.collateral.token.address,
    operationNameInBytes,
    triggerData.executionLTV,
    triggerData.targetLTV,
    triggerData.minSellPrice,
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
