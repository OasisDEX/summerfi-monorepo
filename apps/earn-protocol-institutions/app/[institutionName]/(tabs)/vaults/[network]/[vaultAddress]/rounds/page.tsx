import { type NetworkNames } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/config'
import {
  getCachedInstitutionVaults,
  getCachedRwaVaultRoundPositions,
} from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelRwaRounds } from '@/features/panels/vaults/components/PanelRwaRounds/PanelRwaRounds'
import { getRwaClientIdForVault, urlNetworkToChainId } from '@/helpers/rwa'

export default async function InstitutionVaultRoundsPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const config = await getCachedConfig()
  const chainId = urlNetworkToChainId(network)
  const rwaClientId = getRwaClientIdForVault({
    systemConfig: config,
    networkId: chainId,
    vaultAddress,
  })

  // RWA-only tab: a standard vault has no rounds-based lifecycle, so bounce to its overview.
  if (!rwaClientId) {
    redirect(`/${institutionName}/vaults/${network}/${vaultAddress}/overview/institution`)
  }

  // Standing per-round deposit (Input) / withdrawal (Output) positions, grouped by round in the panel.
  // Share price (NAV) is the same value the vault header shows — used to value Output (withdrawal)
  // positions in USD, since pre-settlement rounds have no exchange rate yet.
  const [{ positions }, institutionVaults] = await Promise.all([
    getCachedRwaVaultRoundPositions({
      institutionName,
      network: humanNetworktoSDKNetwork(network),
      vaultAddress,
    }),
    getCachedInstitutionVaults({ institutionName }),
  ])

  const sharePrice =
    institutionVaults?.vaultsAdditionalInfo.vaultSharePriceMap[
      `${vaultAddress.toLowerCase()}-${chainId}`
    ]
  const navPrice = sharePrice ? Number(sharePrice) : null

  return (
    <ClientSideSdkWrapper>
      <PanelRwaRounds
        institutionName={institutionName}
        clientId={rwaClientId}
        vaultAddress={vaultAddress}
        network={network}
        positions={positions}
        navPrice={navPrice}
      />
    </ClientSideSdkWrapper>
  )
}
