import { SerializationService } from '@summerfi/sdk-common'
import { TRPCError, initTRPC } from '@trpc/server'
import { jwtVerify } from 'jose'
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

/**
 * Verifies an EARN JWT bearer token using EARN_PROTOCOL_JWT_SECRET.
 * Returns the decoded payload on success, throws UNAUTHORIZED on failure.
 */
export async function verifyEarnBearerToken(bearerToken: string): Promise<void> {
  const jwtSecret = process.env.EARN_PROTOCOL_JWT_SECRET
  if (!jwtSecret) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'JWT secret not configured' })
  }

  const token = bearerToken.startsWith('Bearer ') ? bearerToken.slice(7) : bearerToken
  if (!token) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing bearer token' })
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(jwtSecret), { algorithms: ['HS512'] })
  } catch {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired bearer token' })
  }
}
