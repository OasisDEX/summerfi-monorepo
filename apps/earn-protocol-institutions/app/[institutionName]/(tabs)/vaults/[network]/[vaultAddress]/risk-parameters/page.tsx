import { type NetworkNames } from '@summerfi/app-types'
import { decorateWithFleetConfig, humanNetworktoSDKNetwork } from '@summerfi/app-utils'

import { getCachedConfig } from '@/app/server-handlers/config'
import {
  getCachedInstitutionVaultArksImpliedCapsMap,
  getCachedVaultDetails,
} from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelRiskParameters } from '@/features/panels/vaults/components/PanelRiskParameters/PanelRiskParameters'

export default async function InstitutionVaultRiskParametersPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)

  const [vault, config] = await Promise.all([
    getCachedVaultDetails({
      institutionName,
      vaultAddress,
      network: parsedNetwork,
    }),
    getCachedConfig(),
  ])

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
