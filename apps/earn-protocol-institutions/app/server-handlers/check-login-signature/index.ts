import { getLoginSignature } from '@/helpers/get-login-signature'
import { getSSRPublicClient } from '@/helpers/get-ssr-public-client'

export const checkLoginSignature = async ({
  userWalletAddress,
  loginSignature,
}: {
  userWalletAddress?: string
  loginSignature?: string
}) => {
  if (!userWalletAddress || !loginSignature) {
    return false
  }

  const expectedSignature = getLoginSignature(userWalletAddress)

  const client = await getSSRPublicClient(1) // does not matter for the signature check

  if (!client) {
    // eslint-disable-next-line no-console
    console.error('SSR Public Client is not available for signature verification')

    return false
  }

  // Actual check
  const isValid = await client.verifyMessage({
    address: userWalletAddress as `0x${string}`,
    message: expectedSignature,
    signature: loginSignature as `0x${string}`,
  })

  return isValid
}
