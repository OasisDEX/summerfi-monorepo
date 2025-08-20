/**
 * Client
 */
export { useTermsOfService } from './client/hooks/useTermsOfService'

export type { TOSSignMessage, TOSInput, TOSRequestContext } from './types'

/**
 * Server handlers (Next.js App router)
 */
export { makeChallenge } from './server/auth/make-challenge'
export { makeSignIn } from './server/auth/make-signin'
export { checkAuth } from './server/auth/check-auth'

export { signTos } from './server/tos/sign-tos'
export { getTos } from './server/tos/get-tos'
