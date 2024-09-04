import { isArmadaPoolId } from '@summerfi/armada-protocol-common'
import { SDKError, SDKErrorType, isTokenAmount } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const setFleetDepositCap = publicProcedure.input(z.any()).query(async (opts) => {
  const returnedErrors: string[] = []

  if (opts.input == null) {
    throw SDKError.createFrom({
      reason: 'Invalid set fleet deposit cap request',
      message: 'Missing input',
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isArmadaPoolId(opts.input.poolId, returnedErrors)) {
    throw SDKError.createFrom({
      reason: 'Invalid pool id in set fleet deposit cap request',
      message: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isTokenAmount(opts.input.cap, returnedErrors)) {
    throw SDKError.createFrom({
      reason: 'Invalid cap in set fleet deposit cap request',
      message: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  return opts.ctx.armadaManager.setFleetDepositCap(opts.input)
})
