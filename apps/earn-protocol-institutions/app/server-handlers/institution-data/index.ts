import { institutionsMockList } from '@/app/server-handlers/mock'

export const getInstitutionData = async (institutionId: string) => {
  // get the 'global' institution data here
  // this is a mock implementation, replace with actual data fetching logic

  if (!institutionId) {
    throw new Error('Institution ID is required')
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 1)
  }) // Simulate network delay

  const institution = institutionsMockList.find((inst) => inst.id === institutionId)

  if (!institution) {
    throw new Error(`Institution with ID ${institutionId} not found`)
  }

  return institution
}
