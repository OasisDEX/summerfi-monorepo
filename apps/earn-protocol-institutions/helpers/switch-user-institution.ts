export const switchUserInstitution = async ({
  userWalletAddress,
  institutionId,
}: {
  userWalletAddress: string
  institutionId?: string | null
}) => {
  if (!userWalletAddress) {
    throw new Error('Wallet address is required to switch institutions')
  }

  const queryParams = new URLSearchParams()

  queryParams.append('userWalletAddress', userWalletAddress)
  if (institutionId) {
    queryParams.append('institutionId', institutionId)
  }

  const response = await fetch(`/api/get-user-institutions?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorMessage = await response.text()

    throw new Error(`Failed to switch institution: ${errorMessage}`)
  }

  const data = (await response.json()) as { institution: string }

  return data.institution
}
