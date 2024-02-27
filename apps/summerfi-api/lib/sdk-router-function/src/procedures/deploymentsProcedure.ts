import { publicProcedure } from '~src/trpc'
import { Deployments } from '@summerfi/core-contracts'

export const deploymentsProcedure = publicProcedure.use(async (opts) => {
  return opts.next({
    ctx: {
      deployments: Deployments,
    },
  })
})
