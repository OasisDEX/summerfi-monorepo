export const getWalletInstitutions = async (walletAddress: string) => {
  if (!walletAddress) {
    throw new Error('Institution ID is required')
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  }) // Simulate network delay

  return ['acme-crypto-corp']
}
