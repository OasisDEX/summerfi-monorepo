import { institutionsMockList } from '@/app/server-handlers/mock'

export const getVaultData = async (institutionId: string, vaultId: string) => {
  // get the 'global' institution data here
  // this is a mock implementation, replace with actual data fetching logic

  if (!institutionId) {
    throw new Error('Institution ID is required')
  }

  if (!vaultId) {
    throw new Error('Vault ID is required')
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 1)
  }) // Simulate network delay

  const institution = institutionsMockList.find((inst) => inst.id === institutionId)

  if (!institution) {
    throw new Error(`Institution with ID ${institutionId} not found`)
  }

  const vault = institution.vaultsData.find((v) => v.id === vaultId)

  if (!vault) {
    throw new Error(`Vault with ID ${vaultId} not found`)
  }

  return { vault }
}
