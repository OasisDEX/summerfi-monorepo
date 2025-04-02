import { SerializationService } from '@summerfi/sdk-common/services'
import { initTRPC } from '@trpc/server'
import { SDKAppContext } from './context/SDKContext'

export const t = initTRPC.context<SDKAppContext>().create({
  transformer: SerializationService.getTransformer(),
})

export const router = t.router

export const createCallerFactory = t.createCallerFactory

export const publicProcedure = t.procedure.use(async (opts) => {
  const { ctx, path } = opts
  const isLoggingEnabled = process.env.SDK_LOGGING_ENABLED === 'true'
  const start = isLoggingEnabled ? performance.now() : 0

  if (isLoggingEnabled) {
    console.log(`[CALL] Procedure: ${path} (${ctx.callKey})`)
  }

  const result = await opts.next()

  if (isLoggingEnabled) {
    try {
      const end = performance.now()
      console.log(
        `[RESULT] Procedure: ${path} (${ctx.callKey}) took ${end - start} milliseconds. Data: ${JSON.stringify((result as { data: unknown })?.data)}`,
      )
    } catch (error) {
      const end = performance.now()
      console.log(
        `[RESULT] Procedure: ${path} (${ctx.callKey}): Cannot serialize data. Took ${end - start} milliseconds.`,
      )
    }
  }

  return result
})
