import { z } from 'zod'
import { publicProcedure } from '../EarnProtocolTRPC'
import { SDKError, SDKErrorType, isChainInfo, isTokenAmount, isUser } from '@summerfi/sdk-common'

export const deposit = publicProcedure.input(z.any()).query(async (opts) => {
  const returnedErrors: string[] = []

  if (!isChainInfo(opts.input.chainInfo, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid chain info in deposit request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.EarnProtocolError,
    })
  }

  if (!isUser(opts.input.chainInfo, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid user in deposit request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.EarnProtocolError,
    })
  }

  if (!isTokenAmount(opts.input.chainInfo, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid token amount in deposit request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.EarnProtocolError,
    })
  }

  return opts.ctx.earnProtocolManager.deposit(opts.input)
})
