import { z } from 'zod'

import {
  addressSchema,
  chainIdSchema,
  optionalPoolIdSchema,
  urlOptionalSchema,
} from '@summerfi/serverless-shared/validators'

export const paramsSchema = z.object({
  account: addressSchema,
  poolId: optionalPoolIdSchema,
  chainId: chainIdSchema,
  rpc: urlOptionalSchema,
  getDetails: z
    .boolean()
    .or(z.string().transform((s) => s === 'true'))
    .optional()
    .default(false),
})
