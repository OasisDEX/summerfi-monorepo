import {
  SDKError,
  SDKErrorType,
  isAddress,
  isChainInfo,
  isTokenAmount,
  isUser,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'

export const deposit = publicProcedure.input(z.any()).query(async (opts) => {
  const returnedErrors: string[] = []

  if (opts.input == null) {
    throw SDKError.createFrom({
      message: 'Invalid deposit request',
      reason: 'Missing input',
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isChainInfo(opts.input.chainInfo, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid chain info in deposit request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isAddress(opts.input.fleetAddress, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid fleet address in deposit request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isUser(opts.input.user, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid user in deposit request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isTokenAmount(opts.input.amount, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid token amount in deposit request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  return opts.ctx.armadaManager.deposit(opts.input)
})
