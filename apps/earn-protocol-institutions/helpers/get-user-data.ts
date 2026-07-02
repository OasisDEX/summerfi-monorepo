import { type GlobalRoles } from '@summerfi/sdk-client'

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
      walletAddressRoles: GlobalRoles[]
      roles: { [key in GlobalRoles]: boolean }
      // Human-readable labels for the connected wallet's RWA roles (e.g. "Curator", "Keeper"). Empty
      // for standard institutions / wallets with no RWA role.
      rwaRoleLabels: string[]
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
    walletAddressRoles: GlobalRoles[]
    roles: { [key in GlobalRoles]: boolean }
    rwaRoleLabels: string[]
  } | null

  return data ?? undefined
}
