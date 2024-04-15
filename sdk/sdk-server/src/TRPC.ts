import { initTRPC } from '@trpc/server'
import { SDKAppContext } from './context/Context'
import { SerializationService } from '@summerfi/sdk-common/services'

export const t = initTRPC
  .context<SDKAppContext>()
  .create({ transformer: SerializationService.getTransformer() })

export const router = t.router

export const createCallerFactory = t.createCallerFactory

export const publicProcedure = t.procedure.use(async (opts) => {
  const { getRawInput, path, type } = opts
  console.log('- path => ', path)
  console.log('- type => ', type)
  console.log('- rawInput => ', JSON.stringify(await getRawInput(), null, 2))

  const result = await opts.next()
  return result
})
