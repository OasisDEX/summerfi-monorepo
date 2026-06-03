import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'

import { getCachedInstitutionData } from '@/app/server-handlers/institution/institution-data'
import {
  getCachedInstitutionVault,
  getCachedInstitutionVaults,
} from '@/app/server-handlers/institution/institution-vaults'
import { VaultsDropdownWrapper } from '@/components/layout/VaultsDropdownWrapper/VaultsDropdownWrapper'
import { VaultsPanelNavigationWrapper } from '@/components/layout/VaultsPanelNavigationWrapper/VaultsPanelNavigationWrapper'

import institutionVaultLayoutStyles from './InstitutionVaultLayout.module.css'

// Streamed inside the vault-detail layout (its own Suspense boundary) so the layout body no longer
// blocks the whole vault section on these fetches — the tab content + header can paint in parallel.
export const VaultDetailPanel = async ({
  institutionName,
  network,
  vaultAddress,
}: {
  institutionName: string
  network: string
  vaultAddress: string
}) => {
  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const [institutionData, institutionVaults, institutionVault] = await Promise.all([
    getCachedInstitutionData({ institutionName }),
    getCachedInstitutionVaults({ institutionName }),
    getCachedInstitutionVault({ institutionName, network: parsedNetwork, vaultAddress }),
  ])

  if (!institutionData || !institutionVaults || !institutionVault?.vault) {
    return <div>Vault not found.</div>
  }

  return (
    <div className={institutionVaultLayoutStyles.dashboardVaultsPanelWrapper}>
      <VaultsDropdownWrapper
        institution={institutionData}
        vaults={institutionVaults.vaults}
        selectedVault={institutionVault.vault}
      />
      <VaultsPanelNavigationWrapper
        institutionName={institutionName}
        selectedVault={institutionVault.vault}
      />
    </div>
  )
}
