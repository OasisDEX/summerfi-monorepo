import { getLoginSignature } from '@/helpers/get-login-signature'
import { getSSRPublicClient } from '@/helpers/get-ssr-public-client'

export const checkLoginSignature = async ({
  userWalletAddress,
  loginSignature,
  chainId,
}: {
  userWalletAddress: string
  loginSignature: string
  chainId: number
}) => {
  const expectedSignature = getLoginSignature(userWalletAddress)

  const client = await getSSRPublicClient(chainId)

  if (!client) {
    throw new Error(`Public client not found for the specified chain ID: ${chainId}`)
  }
  // Actual check
  const isValid = await client.verifyMessage({
    address: userWalletAddress as `0x${string}`,
    message: expectedSignature,
    signature: loginSignature as `0x${string}`,
  })

  return isValid
}
