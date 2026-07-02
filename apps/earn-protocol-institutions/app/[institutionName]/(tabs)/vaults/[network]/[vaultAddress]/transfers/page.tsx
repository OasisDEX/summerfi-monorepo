import { type NetworkNames } from '@summerfi/app-types'
import { redirect } from 'next/navigation'

// Share-token transferability moved into the Risk Parameters panel (RWA-exclusive). This legacy
// route just forwards there so any existing bookmarks keep working.
export default async function InstitutionVaultTransfersPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  redirect(`/${institutionName}/vaults/${network}/${vaultAddress}/risk-parameters`)
}
