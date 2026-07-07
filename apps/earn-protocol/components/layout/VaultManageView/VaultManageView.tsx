'use client'

import { Text } from '@summerfi/app-earn-ui'
import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { useVaultManageCoreQuery } from '@/components/layout/VaultManageView/useVaultManageQuery'
import { VaultManageLoadingView } from '@/components/layout/VaultManageView/VaultManageLoadingView'
import { VaultManageViewComponent } from '@/components/layout/VaultManageView/VaultManageViewComponent'
import { sdkApiUrl } from '@/constants/sdk'

export const VaultManageView = ({
  network,
  vaultId,
  walletAddress,
}: {
  network: SupportedSDKNetworks
  vaultId: string
  walletAddress: string
  // Retained for page-level API compatibility only; RWA vaults are no longer rendered here.
  isRwaVault?: boolean
}) => {
  // Reads straight from the server-hydrated cache on first render; only ever hits the API route
  // fallback if the prefetch failed to dehydrate (then VaultManageLoadingView covers the gap).
  const { data, isPending } = useVaultManageCoreQuery(network, vaultId, walletAddress)

  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      {isPending ? (
        <VaultManageLoadingView />
      ) : data ? (
        <VaultManageViewComponent
          network={network}
          vaultId={vaultId}
          systemConfig={data.systemConfig}
          vault={data.vault}
          vaultInfo={data.vaultInfo}
          vaults={data.vaults}
          vaultsApyByNetworkMap={data.vaultsApyByNetworkMap}
          position={data.position}
          viewWalletAddress={data.viewWalletAddress}
          noOfDeposits={data.noOfDeposits}
          rewardTokenPrices={data.rewardTokenPrices}
          rewardTokensClaimableNow={data.rewardTokensClaimableNow}
        />
      ) : (
        <Text>
          No position found on {walletAddress} on the network {network}
        </Text>
      )}
    </SDKContextProvider>
  )
}
