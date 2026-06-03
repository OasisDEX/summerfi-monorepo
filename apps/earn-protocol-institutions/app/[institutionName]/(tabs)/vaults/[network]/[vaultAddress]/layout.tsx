import { type ReactNode, Suspense } from 'react'

import { DashboardContentLayout } from '@/components/layout/DashboardContentLayout/DashboardContentLayout'

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
