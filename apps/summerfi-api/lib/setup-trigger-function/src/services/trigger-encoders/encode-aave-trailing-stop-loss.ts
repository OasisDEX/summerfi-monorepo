import { CurrentTriggerLike, TriggerTransactions } from './types'
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
import { DmaAaveTrailingStopLossTriggerData, PositionLike } from '~types'
import { LatestPrice } from '@summerfi/prices-subgraph'

export const encodeAaveTrailingStopLoss = (
  position: PositionLike,
  triggerData: DmaAaveTrailingStopLossTriggerData,
  latestPrice: LatestPrice,
  currentTrigger: CurrentTriggerLike | undefined,
): TriggerTransactions => {
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

  const operationName = OPERATION_NAMES.aave.v3.CLOSE_POSITION
  const operationNameInBytes = bytesToHex(stringToBytes(operationName, { size: 32 }))

  const encodedTriggerData = encodeAbiParameters(abiParameters, [
    position.address,
    triggerData.type,
    MAX_COVERAGE_BASE * 10n ** BigInt(position.debt.token.decimals),
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
        args: [[currentTrigger.id], [currentTrigger.triggerData], true],
      })
    : undefined

  return {
    encodedTriggerData,
    upsertTrigger: encodedTrigger,
    removeTrigger,
  }
}
