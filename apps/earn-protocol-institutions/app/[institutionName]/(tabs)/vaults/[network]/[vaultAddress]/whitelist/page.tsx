import { type NetworkNames } from '@summerfi/app-types'
import { networkNameToSDKId } from '@summerfi/app-utils'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/config'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelRwaWhitelist } from '@/features/panels/vaults/components/PanelRwaWhitelist/PanelRwaWhitelist'
import { isRwaVaultByConfig } from '@/helpers/rwa'

export default async function InstitutionVaultWhitelistPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const config = await getCachedConfig()
  const chainId = networkNameToSDKId(network)

  // RWA-only tab: a standard vault has no rounds-based whitelist surface, so bounce to its overview.
  if (!isRwaVaultByConfig({ systemConfig: config, networkId: chainId, vaultAddress })) {
    redirect(`/${institutionName}/vaults/${network}/${vaultAddress}/overview/institution`)
  }

  return (
    <ClientSideSdkWrapper>
      <PanelRwaWhitelist
        institutionName={institutionName}
        vaultAddress={vaultAddress}
        network={network}
      />
    </ClientSideSdkWrapper>
  )
}
