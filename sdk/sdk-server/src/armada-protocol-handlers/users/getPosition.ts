import { isArmadaPoolId, isArmadaPositionId } from '@summerfi/armada-protocol-common'
import { SDKError, SDKErrorType } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getPosition = publicProcedure.input(z.any()).query(async (opts) => {
  const returnedErrors: string[] = []

  if (opts.input == null) {
    throw SDKError.createFrom({
      message: 'Invalid getPosition request',
      reason: 'Missing input',
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isArmadaPoolId(opts.input.poolId, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid pool ID in getPosition request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isArmadaPositionId(opts.input.positionId, returnedErrors)) {
    throw SDKError.createFrom({
      message: 'Invalid position ID in getPosition request',
      reason: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  return opts.ctx.armadaManager.getPosition(opts.input)
})
