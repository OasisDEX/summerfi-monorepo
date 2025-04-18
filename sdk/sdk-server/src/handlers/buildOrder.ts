import { Maybe, SDKError, SDKErrorType } from '@summerfi/sdk-common'
import type { Order } from '@summerfi/sdk-common'

import { isBuildOrderInputs } from '@summerfi/order-planner-common/'
import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'

export const buildOrder = publicProcedure
  .input(z.any())
  .mutation(async (opts): Promise<Maybe<Order>> => {
    const returnedErrors: string[] = []

    if (!isBuildOrderInputs(opts.input, returnedErrors)) {
      throw SDKError.createFrom({
        type: SDKErrorType.OrderPlannerError,
        reason: 'Invalid inputs received for build order',
        message: returnedErrors.join('\n'),
      })
    }

    return opts.ctx.orderPlannerService.buildOrder({
      user: opts.input.user,
      positionsManager: opts.input.positionsManager,
      simulation: opts.input.simulation,
      armadaManager: opts.ctx.armadaManager,
      swapManager: opts.ctx.swapManager,
      addressBookManager: opts.ctx.addressBookManager,
      protocolsRegistry: opts.ctx.protocolsRegistry,
      contractsProvider: opts.ctx.contractsProvider,
    })
  })
