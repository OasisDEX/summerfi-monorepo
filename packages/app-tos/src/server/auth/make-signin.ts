import { type JWTChallenge, type JwtPayload, SDKChainId } from '@summerfi/app-types'
import { chainIdSchema, getRpcGatewayEndpoint, type IRpcConfig } from '@summerfi/serverless-shared'
import { jwtVerify, SignJWT } from 'jose'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { type NextRequest, NextResponse } from 'next/server'
import {
  type Chain as ViemChain,
  createPublicClient,
  http,
  type PublicClient,
  recoverMessageAddress,
} from 'viem'
import { arbitrum, base, mainnet, optimism, sepolia, sonic } from 'viem/chains'
import * as z from 'zod'

import { checkIfArgentWallet } from '@/server/helpers/check-if-argent'
import { checkIfSafeOwner } from '@/server/helpers/check-if-safe'
import { isValidSignature } from '@/server/helpers/is-valid-signature'
import { recreateSignedMessage } from '@/server/helpers/recreate-signed-message'
import { TOSMessageTypeSchema } from '@/types'

const inputSchema = z.object({
  challenge: z.string(),
  signature: z.string(),
  chainId: chainIdSchema,
  isGnosisSafe: z.boolean(),
  cookiePrefix: z.string(),
  type: TOSMessageTypeSchema,
})

const domainChainIdToViemChain: { [key in SDKChainId]: ViemChain } = {
  [SDKChainId.MAINNET]: mainnet,
  [SDKChainId.ARBITRUM]: arbitrum,
  [SDKChainId.OPTIMISM]: optimism,
  [SDKChainId.BASE]: base,
  [SDKChainId.SEPOLIA]: sepolia,
  [SDKChainId.SONIC]: sonic,
}
const rpcConfig: IRpcConfig = {
  skipCache: false,
  skipMulticall: false,
  skipGraph: true,
  stage: 'prod',
  source: 'summer-protocol-prod',
}

export async function makeSignIn({
  req,
  jwtSecret,
  jwtChallengeSecret,
  rpcGateway,
}: {
  req: NextRequest
  jwtSecret: string
  jwtChallengeSecret: string
  rpcGateway: string
}): Promise<
  NextResponse<
    | {
        error: string
      }
    | {
        jwt: string
      }
  >
> {
  const body = inputSchema.parse(await req.json())

  let challenge: JWTChallenge

  try {
    if (!body.challenge || !jwtChallengeSecret) {
      throw new Error('No challenge provided')
    }
    const jwtChallengeSecretEncoded = new TextEncoder().encode(jwtChallengeSecret)

    challenge = (
      await jwtVerify(body.challenge, jwtChallengeSecretEncoded, {
        algorithms: ['HS512'],
      })
    ).payload.payload as JWTChallenge
  } catch (e) {
    return NextResponse.json({ error: 'Invalid challenge' }, { status: 400 })
  }

  const rpcUrl = getRpcGatewayEndpoint(rpcGateway, body.chainId, rpcConfig)

  const transport = http(rpcUrl, {
    batch: false,
    fetchOptions: {
      method: 'POST',
    },
  })

  const viemChain: ViemChain = domainChainIdToViemChain[body.chainId]

  const client: PublicClient = createPublicClient({
    chain: viemChain,
    transport,
  })

  const message = recreateSignedMessage(challenge, body.type)

  const { isGnosisSafe } = body
  let isArgentWallet = false

  try {
    // argent wallet is only on mainnet
    if (body.chainId === 1) {
      isArgentWallet = await checkIfArgentWallet(client, challenge.address)
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Check if argent wallet failed', e)
  }

  if (isGnosisSafe || isArgentWallet) {
    const isValid = await isValidSignature({
      client,
      address: challenge.address,
      message,
      signature: body.signature as `0x${string}`,
    })

    if (!isValid) {
      throw new Error('Signature not correct - eip1271')
    }
  } else {
    const signedAddress = await recoverMessageAddress({
      message,
      signature: body.signature as `0x${string}`,
    })

    if (signedAddress.toLowerCase() !== challenge.address) {
      const isOwner = await checkIfSafeOwner(client, challenge, signedAddress)

      if (!isOwner) {
        // it might be a wallet connect + safe, no way to check
        // that during connect/sign so im checking that here
        const isValid = await isValidSignature({
          client,
          address: challenge.address,
          message,
          signature: body.signature as `0x${string}`,
        })

        if (!isValid) {
          throw new Error('Signature not correct - personal sign')
        }
      }
    }
  }

  const userJwtPayload: JwtPayload = {
    address: challenge.address,
    signature: body.signature,
    challenge: body.challenge,
    chainId: body.chainId,
  }

  const secret = new TextEncoder().encode(jwtSecret)

  const token = await new SignJWT({
    payload: userJwtPayload,
  })
    .setIssuedAt()
    .setProtectedHeader({ alg: 'HS512' })
    .sign(secret)

  const response = NextResponse.json({ jwt: token })

  const commonPayload: ResponseCookie = {
    name: `${body.cookiePrefix}-${challenge.address.toLowerCase()}`,
    value: token,
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
    sameSite: 'none',
    path: '/',
  }

  response.cookies.set(commonPayload)

  return response
}
