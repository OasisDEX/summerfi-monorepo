import { isArmadaPoolId } from '@summerfi/armada-protocol-common'
import { SDKError, SDKErrorType, isTokenAmount, isUser } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'

export const getNewDepositTX = publicProcedure.input(z.any()).query(async (opts) => {
  const returnedErrors: string[] = []

  if (!isArmadaPoolId(opts.input.poolId, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid pool ID in getNewDepositTX request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isUser(opts.input.user, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid user in getNewDepositTX request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isTokenAmount(opts.input.amount, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid token amount in getNewDepositTX request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  return opts.ctx.armadaManager.getNewDepositTX(opts.input)
})
