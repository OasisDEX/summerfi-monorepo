import { type GeneralRoles } from '@summerfi/sdk-client'

export const getUserData = async ({
  walletAddress,
  institutionName,
}: {
  walletAddress: string
  institutionName: string
}) => {
  return (await fetch(`/api/user/user-details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ walletAddress, institutionName }),
  }).then((res) => res.json())) as Promise<
    | {
        walletAddressRoles: GeneralRoles[]
        roles: {
          [key in GeneralRoles]: boolean
        }
      }
    | undefined
  >
}
