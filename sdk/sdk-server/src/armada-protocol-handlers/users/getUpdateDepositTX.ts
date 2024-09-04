import { isArmadaPoolId, isArmadaPositionId } from '@summerfi/armada-protocol-common'
import { SDKError, SDKErrorType, isTokenAmount } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getUpdateDepositTX = publicProcedure.input(z.any()).query(async (opts) => {
  const returnedErrors: string[] = []

  if (opts.input == null) {
    throw SDKError.createFrom({
      message: 'Invalid getUpdateDepositTX request',
      reason: 'Missing input',
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isArmadaPoolId(opts.input.poolId, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid pool ID in getUpdateDepositTX request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isArmadaPositionId(opts.input.positionId, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid position ID in getUpdateDepositTX request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isTokenAmount(opts.input.amount, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid token amount in getUpdateDepositTX request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  return opts.ctx.armadaManager.getUpdateDepositTX(opts.input)
})
