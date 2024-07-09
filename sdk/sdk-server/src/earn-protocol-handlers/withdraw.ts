import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'
import {
  isChainInfo,
  isUser,
  isTokenAmount,
  isAddress,
  SDKError,
  SDKErrorType,
} from '@summerfi/sdk-common'

export const withdraw = publicProcedure.input(z.any()).query(async (opts) => {
  const returnedErrors: string[] = []

  if (opts.input == null) {
    throw SDKError.createFrom({
      message: 'Invalid withdraw request',
      reason: 'Missing input',
      type: SDKErrorType.EarnProtocolError,
    })
  }

  if (!isChainInfo(opts.input.chainInfo, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid chain info in withdraw request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.EarnProtocolError,
    })
  }

  if (!isAddress(opts.input.fleetAddress, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid fleet address in withdraw request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.EarnProtocolError,
    })
  }

  if (!isUser(opts.input.user, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid user in withdraw request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.EarnProtocolError,
    })
  }

  if (!isTokenAmount(opts.input.amount, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid token amount in withdraw request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.EarnProtocolError,
    })
  }

  return opts.ctx.earnProtocolManager.withdraw(opts.input)
})
