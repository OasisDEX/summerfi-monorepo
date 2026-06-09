'use client'

import { Text } from '@summerfi/app-earn-ui'
import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { useVaultOpenCoreQuery } from '@/components/layout/VaultOpenView/useVaultOpenQuery'
import { VaultOpenLoadingView } from '@/components/layout/VaultOpenView/VaultOpenLoadingView'
import { VaultOpenViewComponent } from '@/components/layout/VaultOpenView/VaultOpenViewComponent'
import { sdkApiUrl } from '@/constants/sdk'

export const VaultOpenView = ({
  network,
  vaultId,
}: {
  network: SupportedSDKNetworks
  vaultId: string
}) => {
  // Reads straight from the server-hydrated cache on first render; only ever hits the API route
  // fallback if the prefetch failed to dehydrate (then VaultOpenLoadingView covers the gap).
  const { data, isPending } = useVaultOpenCoreQuery(network, vaultId)
  const isRwaVault = data?.vault.isRwaVault ?? false

  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      {isPending ? (
        <VaultOpenLoadingView isRwaVault={isRwaVault} />
      ) : data ? (
        <VaultOpenViewComponent
          network={network}
          vaultId={vaultId}
          vault={data.vault}
          vaults={data.vaults}
          vaultInfo={data.vaultInfo}
          medianDefiYield={data.medianDefiYield}
          vaultApyData={data.vaultApyData}
          referralCode={data.referralCode}
          rewardTokenPrices={data.rewardTokenPrices}
        />
      ) : (
        <Text>
          No vault found with the id {vaultId} on the network {network}
        </Text>
      )}
    </SDKContextProvider>
  )
}
