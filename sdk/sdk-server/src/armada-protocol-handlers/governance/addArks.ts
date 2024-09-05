import { isArmadaPoolId } from '@summerfi/armada-protocol-common'
import { SDKError, SDKErrorType, isAddress } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const addArks = publicProcedure.input(z.any()).query(async (opts) => {
  const returnedErrors: string[] = []

  if (opts.input == null) {
    throw SDKError.createFrom({
      reason: 'Invalid set add arks request',
      message: 'Missing input',
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isArmadaPoolId(opts.input.poolId, returnedErrors)) {
    throw SDKError.createFrom({
      reason: 'Invalid pool id in add arks request',
      message: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  for (const ark of opts.input.arks) {
    if (!isAddress(ark, returnedErrors)) {
      throw SDKError.createFrom({
        reason: 'Invalid ark in add arks request',
        message: returnedErrors.join('\n'),
        type: SDKErrorType.ArmadaError,
      })
    }
  }

  return opts.ctx.armadaManager.addArks(opts.input)
})
