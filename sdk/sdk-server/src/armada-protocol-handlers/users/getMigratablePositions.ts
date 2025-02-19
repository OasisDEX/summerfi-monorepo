import {
  IUser,
  isArmadaMigrationType,
  isChainInfo,
  isUser,
  type ArmadaMigrationType,
  type IChainInfo,
  type ITokenAmount,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getMigratablePositions = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
      chainInfo: z.custom<IChainInfo>(isChainInfo),
      migrationType: z.custom<ArmadaMigrationType>(isArmadaMigrationType).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.migrations.getMigratablePositions(opts.input)
  })
