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

  // RWA vaults render a dedicated risk panel: their data lives in the institutions-v2 subgraph (read
  // via the v2 SDK) rather than the standard fleet sources. They ARE FleetCommander vaults, so the
  // generic fleet admin setters (cap / buffer / ark cap / ark max %) still apply — the panel just
  // resolves them through the v2 SDK, and adds the rounds-vault minimum position size controls.
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

    // RWA vaults are FleetCommander contracts, so the implied (effective) ark deposit cap reads off
    // the same `getEffectiveArkDepositCap` method standard vaults use — the generic implied-caps
    // fetcher works unchanged once given this vault's ark addresses.
    const rwaArksImpliedCapsMap = await getCachedInstitutionVaultArksImpliedCapsMap({
      network: parsedNetwork,
      arksAddresses: riskParameters?.arks.map((ark) => ark.id) ?? [],
      vaultAddress,
      institutionName,
    })

    return (
      <ClientSideSdkWrapper>
        <PanelRwaRiskParameters
          institutionName={institutionName}
          clientId={rwaClientId}
          vaultAddress={vaultAddress}
          network={network}
          riskParameters={riskParameters}
          arksImpliedCapsMap={rwaArksImpliedCapsMap}
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
