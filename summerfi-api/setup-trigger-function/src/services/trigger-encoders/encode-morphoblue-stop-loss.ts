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
import { PositionLike, CurrentTriggerLike } from '@summerfi/triggers-shared'

import { getMaxCoverage } from './get-max-coverage'
import { OPERATION_NAMES } from '@oasisdex/dma-library'
import { AddableTrigger, RemovableTrigger } from './automation-bot-helper'

export const encodeMorphoBlueStopLoss = (
  position: PositionLike,
  triggerData: DmaMorphoBlueStopLossTriggerData,
  currentTrigger: CurrentTriggerLike | undefined,
): TriggerTransactions & EncodedTriggers => {
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
    triggerData.type == BigInt(111111)
      ? OPERATION_NAMES.morphoblue.CLOSE_POSITION
      : triggerData.type == BigInt(111111)
        ? OPERATION_NAMES.morphoblue.CLOSE_POSITION
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
