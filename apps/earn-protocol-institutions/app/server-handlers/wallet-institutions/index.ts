import { institutionsMockList } from '@/app/server-handlers/mock'

export const getWalletInstitutions = async (walletAddress: string) => {
  if (!walletAddress) {
    throw new Error('Wallet address is required')
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 1)
  }) // Simulate network delay

  return institutionsMockList.map(({ id, institutionName }) => ({
    id,
    institutionName,
  }))
}
