import { getWalletInstitutions } from '@/app/server-handlers/get-wallet-institutions'

export const getUserInstitutionView = async ({
  userWalletAddress,
  institutionId,
}: {
  userWalletAddress: string
  institutionId?: string | null // this is to switch between different institutions
}) => {
  const institutions = await getWalletInstitutions(userWalletAddress)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!institutions || institutions.length === 0) {
    throw new Error('No institutions found for this wallet address')
  }
  if (institutionId && !institutions.includes(institutionId)) {
    throw new Error("Institution ID does not match any of the user's institutions")
  }

  return {
    institution: institutionId ?? institutions[0], // Default to the first institution if none is specified
  }
}
