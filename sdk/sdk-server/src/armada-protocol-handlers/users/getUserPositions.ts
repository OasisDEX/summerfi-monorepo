import type { IArmadaPosition } from '@summerfi/armada-protocol-common'
import { SDKError, SDKErrorType, isUser } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getUserPositions = publicProcedure
  .input(z.any())
  .query(async (opts): Promise<IArmadaPosition[]> => {
    const returnedErrors: string[] = []

    if (opts.input == null) {
      throw SDKError.createFrom({
        message: 'Invalid getUserPosition request',
        reason: 'Missing input',
        type: SDKErrorType.ArmadaError,
      })
    }

    if (!isUser(opts.input.user, returnedErrors)) {
      throw SDKError.createFrom({
        message: 'Invalid user in getUserPosition request',
        reason: returnedErrors.join('\n'),
        type: SDKErrorType.ArmadaError,
      })
    }

    return opts.ctx.armadaManager.getUserPositions(opts.input)
  })
