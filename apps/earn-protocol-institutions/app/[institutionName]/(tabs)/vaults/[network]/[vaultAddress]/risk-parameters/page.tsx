import { type NetworkNames } from '@summerfi/app-types'
import { decorateWithFleetConfig, humanNetworktoSDKNetwork } from '@summerfi/app-utils'

import { getCachedConfig } from '@/app/server-handlers/config'
import {
  getCachedInstitutionVaultArksImpliedCapsMap,
  getCachedRwaVaultRiskParameters,
  getCachedVaultDetails,
} from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelRiskParameters } from '@/features/panels/vaults/components/PanelRiskParameters/PanelRiskParameters'
import { PanelRwaRiskParameters } from '@/features/panels/vaults/components/PanelRwaRiskParameters/PanelRwaRiskParameters'
import { getRwaClientIdForVault, urlNetworkToChainId } from '@/helpers/rwa'

export default async function InstitutionVaultRiskParametersPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const config = await getCachedConfig()
  const chainId = urlNetworkToChainId(network)

  // RWA vaults aren't FleetCommander/ark-managed here: the ark-cap admin surface doesn't apply and
  // their data lives in a different subgraph. Render the RWA-specific risk panel (minimum position
  // size + a curator-managed note) instead of the fleet ark-cap panel.
  const rwaClientId = getRwaClientIdForVault({
    systemConfig: config,
    networkId: chainId,
    vaultAddress,
  })

  if (rwaClientId) {
    const riskParameters = await getCachedRwaVaultRiskParameters({
      institutionName,
      network: parsedNetwork,
      vaultAddress,
    })

    return (
      <ClientSideSdkWrapper>
        <PanelRwaRiskParameters
          institutionName={institutionName}
          clientId={rwaClientId}
          vaultAddress={vaultAddress}
          network={network}
          riskParameters={riskParameters}
        />
      </ClientSideSdkWrapper>
    )
  }

  const vault = await getCachedVaultDetails({
    institutionName,
    vaultAddress,
    network: parsedNetwork,
  })

  if (!vault) {
    return <div>Vault not found</div>
  }

  const [vaultWithConfig] = decorateWithFleetConfig([vault], config)

  const arksImpliedCapsMap = await getCachedInstitutionVaultArksImpliedCapsMap({
    network: parsedNetwork,
    arksAddresses: vaultWithConfig.arks.map((ark) => ark.id),
    vaultAddress: vaultWithConfig.id,
    institutionName,
  })

  return (
    <ClientSideSdkWrapper>
      <PanelRiskParameters
        vault={vaultWithConfig}
        arksImpliedCapsMap={arksImpliedCapsMap}
        network={network}
        institutionName={institutionName}
      />
    </ClientSideSdkWrapper>
  )
}
