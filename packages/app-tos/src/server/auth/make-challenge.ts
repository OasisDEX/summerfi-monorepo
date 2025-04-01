import { type JWTChallenge } from '@summerfi/app-types'
import { getRandomString } from '@summerfi/app-utils'
import { SignJWT } from 'jose'
import { type NextRequest, NextResponse } from 'next/server'
import { type Address } from 'viem'
import * as z from 'zod'

const CHALLENGE_JWT_EXPIRATION = '5m' // 5 minutes should be more than enough to sign the challenge on a signer
const GNOSIS_SAFE_CHALLENGE_JWT_EXPIRATION = '1d'

const address = z
  .string()
  .refine(
    (a) => a.toLowerCase() === a && a.length === 42,
    'Address has to be lowercased and be 42 characters string',
  )

const inputSchema = z.object({
  address,
  isGnosisSafe: z.boolean(),
})

/**
 * Generate a JSON Web Token (JWT) challenge based on input parameters.
 *
 * @param req - The NextRequest object representing the incoming request.
 * @param jwtChallengeSecret - The string used to sign the JWT.
 * @returns A promise that resolves to a signed JWT containing the challenge information.
 *
 * @remarks
 * This function parses the request body to extract the address and the `isGnosisSafe` flag,
 * generates a random challenge string, and signs a JWT with the given secret. The JWT expiration
 * is determined based on whether the address is associated with a Gnosis Safe.
 */
export const makeChallenge = async ({
  req,
  jwtChallengeSecret,
}: {
  req: NextRequest
  jwtChallengeSecret: string
}): Promise<
  NextResponse<{
    challenge: string
  }>
> => {
  const body = inputSchema.parse(await req.json())

  const payload: JWTChallenge = {
    address: body.address as Address,
    randomChallenge: getRandomString(),
  }
  const secret = new TextEncoder().encode(jwtChallengeSecret)

  const challenge = await new SignJWT({
    payload,
  })
    .setIssuedAt()
    .setExpirationTime(
      body.isGnosisSafe ? GNOSIS_SAFE_CHALLENGE_JWT_EXPIRATION : CHALLENGE_JWT_EXPIRATION,
    )
    .setProtectedHeader({ alg: 'HS512' })
    .sign(secret)

  return NextResponse.json({ challenge })
}
