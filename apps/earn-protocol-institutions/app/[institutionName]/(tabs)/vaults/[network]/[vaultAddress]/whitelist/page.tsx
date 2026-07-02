import { type NetworkNames } from '@summerfi/app-types'
import { redirect } from 'next/navigation'

// Whitelist controls moved to the bottom of the Roles panel. This legacy route just forwards there
// so any existing bookmarks keep working (a standard vault is bounced off /roles to its overview).
export default async function InstitutionVaultWhitelistPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  redirect(`/${institutionName}/vaults/${network}/${vaultAddress}/roles`)
}
