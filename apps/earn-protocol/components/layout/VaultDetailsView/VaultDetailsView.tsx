'use client'
import { type FC } from 'react'
import { Text, VaultGridDetails } from '@summerfi/app-earn-ui'
import { type SupportedSDKNetworks } from '@summerfi/app-types'

import { useVaultDetailsCoreQuery } from '@/components/layout/VaultDetailsView/useVaultDetailsQuery'
import { VaultDetailsContent } from '@/components/layout/VaultDetailsView/VaultDetailsContent'
import { VaultDetailsLoadingView } from '@/components/layout/VaultDetailsView/VaultDetailsLoadingView'

interface VaultDetailsViewProps {
  network: SupportedSDKNetworks
  vaultId: string
}

export const VaultDetailsView: FC<VaultDetailsViewProps> = ({ network, vaultId }) => {
  // Reads straight from the server-hydrated cache on first render; only ever hits the API route
  // fallback if the prefetch failed to dehydrate (then VaultDetailsLoadingView covers the gap).
  const { data: core, isPending } = useVaultDetailsCoreQuery(network, vaultId)

  if (isPending) {
    return <VaultDetailsLoadingView />
  }

  if (!core) {
    return (
      <Text>
        No vault found with the id {vaultId} on the network {network}
      </Text>
    )
  }

  return (
    <VaultGridDetails vault={core.vault} vaults={core.vaults}>
      <VaultDetailsContent network={network} vaultId={vaultId} vault={core.vault} />
    </VaultGridDetails>
  )
}
