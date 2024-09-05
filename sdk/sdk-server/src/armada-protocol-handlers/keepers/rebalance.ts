import { isArmadaPoolId, isRebalanceData } from '@summerfi/armada-protocol-common'
import { SDKError, SDKErrorType } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const rebalance = publicProcedure.input(z.any()).query(async (opts) => {
  const returnedErrors: string[] = []

  if (opts.input == null) {
    throw SDKError.createFrom({
      reason: 'Invalid rebalance request',
      message: 'Missing input',
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isArmadaPoolId(opts.input.poolId, returnedErrors)) {
    throw SDKError.createFrom({
      reason: 'Invalid pool id in rebalance request',
      message: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  for (const rebalanceData of opts.input.rebalanceData) {
    if (!isRebalanceData(rebalanceData, returnedErrors)) {
      throw SDKError.createFrom({
        reason: 'Invalid reblance data in rebalance request',
        message: returnedErrors.join('\n'),
        type: SDKErrorType.ArmadaError,
      })
    }
  }

  return opts.ctx.armadaManager.rebalance(opts.input)
})
