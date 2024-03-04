import { CurrentTriggerLike, TriggerTransactions } from './types'
import {
  bytesToHex,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  stringToBytes,
} from 'viem'
import { automationBotAbi } from '~abi'
import { DmaAaveTrailingStopLossTriggerData, PositionLike } from '~types'
import { DerivedPrices } from '@summerfi/prices-subgraph'
import { getMaxCoverage } from './get-max-coverage'

export const encodeAaveTrailingStopLoss = (
  position: PositionLike,
  triggerData: DmaAaveTrailingStopLossTriggerData,
  latestPrice: DerivedPrices,
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

  const operationName =
    triggerData.token === position.collateral.token.address
      ? 'CloseAndRemainAAVEV3Position'
      : 'CloseAAVEV3Position_4'

  const operationNameInBytes = bytesToHex(stringToBytes(operationName, { size: 32 }))

  const maxCoverage = getMaxCoverage(position)

  const encodedTriggerData = encodeAbiParameters(abiParameters, [
    position.address,
    triggerData.type,
    maxCoverage,
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
