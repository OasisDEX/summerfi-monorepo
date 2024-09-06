import { isArmadaPoolId, isArmadaRebalanceData } from '@summerfi/armada-protocol-common'
import { SDKError, SDKErrorType } from '@summerfi/sdk-common'

import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const adjustBuffer = publicProcedure.input(z.any()).query(async (opts) => {
  const returnedErrors: string[] = []

  if (opts.input == null) {
    throw SDKError.createFrom({
      reason: 'Invalid adjust buffer request',
      message: 'Missing input',
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isArmadaPoolId(opts.input.poolId, returnedErrors)) {
    throw SDKError.createFrom({
      reason: 'Invalid pool id in adjust buffer request',
      message: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  for (const rebalanceData of opts.input.rebalanceData) {
    if (!isArmadaRebalanceData(rebalanceData, returnedErrors)) {
      throw SDKError.createFrom({
        reason: 'Invalid reblance data in adjust buffer request',
        message: returnedErrors.join('\n'),
        type: SDKErrorType.ArmadaError,
      })
    }
  }

  return opts.ctx.armadaManager.adjustBuffer(opts.input)
})
