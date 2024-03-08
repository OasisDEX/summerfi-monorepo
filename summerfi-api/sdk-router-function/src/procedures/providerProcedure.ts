import { publicProcedure } from '~src/trpc'

export const providerProcedure = publicProcedure.use(async (opts) => {
  // TODO: Add reusable procedure logic here
  return opts.next({
    ctx: {
      provider: () => 'hello',
    },
  })
})
