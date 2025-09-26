import { type GeneralRoles } from '@summerfi/sdk-client'

export const getUserData = async ({
  walletAddress,
  institutionName,
  signal,
}: {
  walletAddress: string
  institutionName: string
  signal?: AbortSignal
}): Promise<
  | {
      walletAddressRoles: GeneralRoles[]
      roles: { [key in GeneralRoles]: boolean }
    }
  | undefined
> => {
  const res = await fetch(`/api/user/user-details`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, institutionName }),
    signal,
  })

  if (!res.ok) return undefined
  const data = (await res.json()) as {
    walletAddressRoles: GeneralRoles[]
    roles: { [key in GeneralRoles]: boolean }
  } | null

  return data ?? undefined
}
