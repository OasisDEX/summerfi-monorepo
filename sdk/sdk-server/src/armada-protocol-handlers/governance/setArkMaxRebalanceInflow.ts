import { isArmadaPoolId } from '@summerfi/armada-protocol-common'
import { SDKError, SDKErrorType, isAddress, isTokenAmount } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const setArkMaxRebalanceInflow = publicProcedure.input(z.any()).query(async (opts) => {
  const returnedErrors: string[] = []

  if (opts.input == null) {
    throw SDKError.createFrom({
      reason: 'Invalid set ark max rebalance inflow request',
      message: 'Missing input',
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isArmadaPoolId(opts.input.poolId, returnedErrors)) {
    throw SDKError.createFrom({
      reason: 'Invalid pool id in set ark max rebalance inflow request',
      message: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isAddress(opts.input.ark, returnedErrors)) {
    throw SDKError.createFrom({
      reason: 'Invalid ark in set ark max rebalance inflow request',
      message: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  if (!isTokenAmount(opts.input.newMaxRebalanceInflow, returnedErrors)) {
    throw SDKError.createFrom({
      reason: 'Invalid max rebalance inflow in set ark max rebalance inflow request',
      message: returnedErrors.join('\n'),
      type: SDKErrorType.ArmadaError,
    })
  }

  return opts.ctx.armadaManager.setArkMaxRebalanceInflow(opts.input)
})