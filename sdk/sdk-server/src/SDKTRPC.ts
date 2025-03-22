import { SerializationService } from '@summerfi/sdk-common/services'
import { initTRPC } from '@trpc/server'
import { SDKAppContext } from './context/SDKContext'

export const t = initTRPC
  .context<SDKAppContext>()
  .create({ transformer: SerializationService.getTransformer() })

export const router = t.router

export const createCallerFactory = t.createCallerFactory

export const publicProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts
  if (process.env.SDK_LOGGING_ENABLED === 'true') {
    console.log('Call url: ', ctx.callUrl)
  }

  const result = await opts.next()
  if (process.env.SDK_LOGGING_ENABLED === 'true') {
    try {
      console.log('Result: ', JSON.stringify((result as { data: unknown })?.data))
    } catch (error) {
      /* empty */
    }
  }
  return result
})
