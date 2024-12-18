import { type JWTChallenge, type JwtPayload } from '@summerfi/app-types'
import {
  type Address,
  ChainId,
  chainIdSchema,
  getRpcGatewayEndpoint,
  type IRpcConfig,
} from '@summerfi/serverless-shared'
import jwt from 'jsonwebtoken'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { type NextRequest, NextResponse } from 'next/server'
import {
  type Chain as ViemChain,
  createPublicClient,
  http,
  type PublicClient,
  recoverMessageAddress,
} from 'viem'
import { arbitrum, base, mainnet, optimism, sepolia } from 'viem/chains'
import * as z from 'zod'

import { checkIfArgentWallet } from '@/server/helpers/check-if-argent'
import { checkIfSafeOwner } from '@/server/helpers/check-if-safe'
import { isValidSignature } from '@/server/helpers/is-valid-signature'
import { recreateSignedMessage } from '@/server/helpers/recreate-signed-message'

const inputSchema = z.object({
  challenge: z.string(),
  signature: z.string(),
  chainId: chainIdSchema,
  isGnosisSafe: z.boolean(),
  cookiePrefix: z.string(),
})

const domainChainIdToViemChain: { [key in ChainId]: ViemChain } = {
  [ChainId.MAINNET]: mainnet,
  [ChainId.ARBITRUM]: arbitrum,
  [ChainId.OPTIMISM]: optimism,
  [ChainId.BASE]: base,
  [ChainId.SEPOLIA]: sepolia,
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
}) {
  const body = inputSchema.parse(await req.json())

  let challenge: JWTChallenge

  try {
    challenge = jwt.verify(body.challenge, jwtChallengeSecret, {
      algorithms: ['HS512'],
    }) as JWTChallenge
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

  const message = recreateSignedMessage(challenge)

  const { isGnosisSafe } = body
  let isArgentWallet = false

  try {
    isArgentWallet = await checkIfArgentWallet(client, challenge.address)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Check if argent wallet failed', e)
  }

  if (isGnosisSafe || isArgentWallet) {
    const isValid = await isValidSignature({
      client,
      address: challenge.address,
      message,
      signature: body.signature as Address,
    })

    if (!isValid) {
      throw new Error('Signature not correct - eip1271')
    }
  } else {
    const signedAddress = await recoverMessageAddress({
      message,
      signature: body.signature as Address,
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
          signature: body.signature as Address,
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
  const token = jwt.sign(userJwtPayload, jwtSecret, { algorithm: 'HS512' })

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
