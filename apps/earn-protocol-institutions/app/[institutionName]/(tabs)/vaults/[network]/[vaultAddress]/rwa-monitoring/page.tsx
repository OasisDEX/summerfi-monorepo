import { type NetworkNames } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/config'
import {
  getCachedInstitutionVault,
  getCachedInstitutionVaultFleetFees,
} from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelRwaMonitoring } from '@/features/panels/vaults/components/PanelRwaMonitoring/PanelRwaMonitoring'
import { getRwaClientIdForVault, urlNetworkToChainId } from '@/helpers/rwa'

export default async function InstitutionVaultRwaMonitoringPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const config = await getCachedConfig()
  const chainId = urlNetworkToChainId(network)
  const rwaClientId = getRwaClientIdForVault({
    systemConfig: config,
    networkId: chainId,
    vaultAddress,
  })

  // RWA-only tab: bounce a standard vault to its overview.
  if (!rwaClientId) {
    redirect(`/${institutionName}/vaults/${network}/${vaultAddress}/overview/institution`)
  }

  const [rwaVault, fleetFees] = await Promise.all([
    getCachedInstitutionVault({ institutionName, network: parsedNetwork, vaultAddress }),
    getCachedInstitutionVaultFleetFees({ institutionName, network: parsedNetwork, vaultAddress }),
  ])
  const vault = rwaVault?.vault
  const customFields = vault?.customFields

  return (
    <ClientSideSdkWrapper>
      <PanelRwaMonitoring
        clientId={rwaClientId}
        vaultAddress={vaultAddress}
        network={network}
        curatorName={customFields?.vaultCurator}
        curatorDescription={customFields?.vaultCuratorDescription}
        factSheetUrl={customFields?.vaultFactSheetUrl}
        navApy30d={vault?.navApy30d}
        navApy30dPartialDays={vault?.navApy30dPartialDays}
        navPriceChange24h={vault?.navPriceChange24h}
        managementFee={fleetFees.managementFee}
        performanceFee={fleetFees.performanceFee}
      />
    </ClientSideSdkWrapper>
  )
}
