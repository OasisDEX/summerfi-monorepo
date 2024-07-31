import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'
import { IPosition, Maybe, isPositionId } from '@summerfi/sdk-common'

export const getPosition = publicProcedure
  .input(z.any())
  .query(async (opts): Promise<Maybe<IPosition>> => {
    if (!isPositionId(opts.input)) {
      throw new Error('Invalid position id')
    }

    throw new Error('Not implemented')
  })
