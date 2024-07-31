import { SerializationService } from '@summerfi/sdk-common/services'
import { initTRPC } from '@trpc/server'
import { SDKAppContext } from './context/SDKContext'

export const t = initTRPC
  .context<SDKAppContext>()
  .create({ transformer: SerializationService.getTransformer() })

export const router = t.router

export const createCallerFactory = t.createCallerFactory

export const publicProcedure = t.procedure.use(async (opts) => {
  const { getRawInput, path, type } = opts
  if (process.env.SDK_LOGGING_ENABLED) {
    console.log('- path => ', path)
    console.log('- type => ', type)
    console.log('- rawInput => ', await getRawInput())
  }

  const result = await opts.next()
  return result
})
