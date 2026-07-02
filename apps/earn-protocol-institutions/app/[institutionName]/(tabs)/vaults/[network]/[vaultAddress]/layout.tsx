import { type ReactNode, Suspense } from 'react'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/config'
import { DashboardContentLayout } from '@/components/layout/DashboardContentLayout/DashboardContentLayout'
import { getRwaClientIdForVault, urlNetworkToChainId } from '@/helpers/rwa'

import { VaultDetailHeader } from './VaultDetailHeader'
import { VaultDetailPanel } from './VaultDetailPanel'
import { VaultDetailHeaderSkeleton, VaultDetailPanelSkeleton } from './VaultDetailSkeletons'

// The layout body stays cheap (only awaits params) so it doesn't block the whole vault section on
// data fetches. The header + panel each fetch inside their own Suspense boundary and stream in,
// while the active tab (with its own loading.tsx) renders in parallel.
export default async function InstitutionVaultLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { institutionName, vaultAddress, network } = await params

  if (!institutionName) {
    return <div>Institution ID not provided.</div>
  }

  if (!vaultAddress) {
    return <div>Vault ID not provided.</div>
  }

  // RWA vaults are owned by the institution whose name equals their config clientId. Their detail
  // fetchers resolve the SDK clientId from the vault config (not the URL `institutionName`), so
  // without this guard an RWA vault belonging to another institution would leak its data under this
  // institution's URL. This runs in the layout body so it blocks the tab content (`children`), unlike
  // the streamed `VaultDetailPanel`. Non-RWA vaults resolve no clientId and pass through.
  const config = await getCachedConfig()
  const rwaClientId = getRwaClientIdForVault({
    systemConfig: config,
    networkId: urlNetworkToChainId(network),
    vaultAddress,
  })

  if (rwaClientId && rwaClientId !== institutionName) {
    redirect(`/${institutionName}/overview/institution`)
  }

  return (
    <DashboardContentLayout
      panel={
        <Suspense fallback={<VaultDetailPanelSkeleton />}>
          <VaultDetailPanel
            institutionName={institutionName}
            network={network}
            vaultAddress={vaultAddress}
          />
        </Suspense>
      }
      header={
        <Suspense fallback={<VaultDetailHeaderSkeleton />}>
          <VaultDetailHeader
            institutionName={institutionName}
            network={network}
            vaultAddress={vaultAddress}
          />
        </Suspense>
      }
    >
      {children}
    </DashboardContentLayout>
  )
}
