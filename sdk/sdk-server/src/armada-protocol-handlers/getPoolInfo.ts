import { isArmadaPoolId } from '@summerfi/armada-protocol-common'
import { SDKError, SDKErrorType } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'

export const getPoolInfo = publicProcedure.input(z.any()).query(async (opts) => {
  const returnedErrors: string[] = []

  if (opts.input == null) {
    throw SDKError.createFrom({
      message: 'Invalid getPoolInfo request',
      reason: 'Missing input',
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isArmadaPoolId(opts.input.id, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid chain info in getPoolInfo request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  return opts.ctx.armadaManager.getPoolInfo(opts.input)
})
