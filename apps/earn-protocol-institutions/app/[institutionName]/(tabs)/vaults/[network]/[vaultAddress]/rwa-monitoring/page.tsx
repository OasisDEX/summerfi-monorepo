import { type NetworkNames } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork, networkNameToSDKId } from '@summerfi/app-utils'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/config'
import { getCachedInstitutionVault } from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelRwaMonitoring } from '@/features/panels/vaults/components/PanelRwaMonitoring/PanelRwaMonitoring'
import { isRwaVaultByConfig } from '@/helpers/rwa'

export default async function InstitutionVaultRwaMonitoringPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const config = await getCachedConfig()
  const chainId = networkNameToSDKId(network)

  // RWA-only tab: bounce a standard vault to its overview.
  if (!isRwaVaultByConfig({ systemConfig: config, networkId: chainId, vaultAddress })) {
    redirect(`/${institutionName}/vaults/${network}/${vaultAddress}/overview/institution`)
  }

  const rwaVault = await getCachedInstitutionVault({
    institutionName,
    network: parsedNetwork,
    vaultAddress,
  })
  const customFields = rwaVault?.vault.customFields

  return (
    <ClientSideSdkWrapper>
      <PanelRwaMonitoring
        institutionName={institutionName}
        vaultAddress={vaultAddress}
        network={network}
        curatorName={customFields?.vaultCurator}
        curatorDescription={customFields?.vaultCuratorDescription}
        factSheetUrl={customFields?.vaultFactSheetUrl}
      />
    </ClientSideSdkWrapper>
  )
}
