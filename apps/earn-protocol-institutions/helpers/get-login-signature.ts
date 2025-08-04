export const getLoginSignature = (userWalletAddress: string) => {
  if (!userWalletAddress) {
    throw new Error('User wallet address is required to get login signature')
  }

  return `Login signature for Summer.fi Institution dashboard - user wallet ${userWalletAddress}.`
}
