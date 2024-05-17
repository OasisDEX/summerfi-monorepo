import { EncodedTriggers, TriggerTransactions } from './types'
import {
  bytesToHex,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  stringToBytes,
} from 'viem'
import { automationBotAbi } from '@summerfi/abis'
import { DmaMorphoBlueStopLossTriggerData } from '~types'
import { CurrentTriggerLike, PositionLike } from '@summerfi/triggers-shared'

import { getMaxCoverage } from './get-max-coverage'
import { OPERATION_NAMES } from '@oasisdex/dma-library'
import { AddableTrigger, RemovableTrigger } from './automation-bot-helper'

export const encodeMorphoBlueStopLoss = (
  position: PositionLike,
  triggerData: DmaMorphoBlueStopLossTriggerData,
  currentTrigger: CurrentTriggerLike | undefined,
): TriggerTransactions & EncodedTriggers => {
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
      'bool closeToCollateral',
  )

  const operationName =
    triggerData.token === position.collateral.token.address
      ? OPERATION_NAMES.morphoblue.CLOSE_AND_REMAIN
      : OPERATION_NAMES.morphoblue.CLOSE_AND_REMAIN
      // Note: We use close and remain name for both here as the hash of hashes for both ops are the same
      // May cause issues tracking in Subgraph
      // : OPERATION_NAMES.morphoblue.CLOSE_POSITION

  if (operationName === undefined) {
    throw new Error('Invalid trigger type')
  }

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
    triggerData.executionLTV,
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
          currentTrigger.triggersOnAccount === 1, //remove allowance only if it's the last trigger
        ],
      })
    : undefined

  const addableTrigger: AddableTrigger = {
    continuous: false,
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
    encodedTriggerData,
    upsertTrigger: encodedTrigger,
    removeTrigger,
    addableTrigger,
    removableTrigger,
  }
}
