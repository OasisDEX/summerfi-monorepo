import { isArmadaPoolId } from '@summerfi/armada-protocol-common'
import { SDKError, SDKErrorType } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getPoolInfo = publicProcedure.input(z.any()).query(async (opts) => {
  const returnedErrors: string[] = []

  if (opts.input == null) {
    throw SDKError.createFrom({
      message: 'Invalid getPoolInfo request',
      reason: 'Missing input',
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isArmadaPoolId(opts.input.poolId, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid ArmadaPool in getPoolInfo request: ' + returnedErrors.join(', '),
      reason: 'Validation failed',
      type: SDKErrorType.ArmadaError,
    })
  }

  return opts.ctx.armadaManager.getPoolInfo(opts.input)
})
