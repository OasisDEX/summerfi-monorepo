import { type ReactNode } from 'react'

import { getInstitutionData } from '@/app/server-handlers/institution-data'
import { getVaultData } from '@/app/server-handlers/vault-data'
import { DashboardContentLayout } from '@/components/layout/DashboardContentLayout/DashboardContentLayout'
import { VaultsDropdownWrapper } from '@/components/layout/VaultsDropdownWrapper/VaultsDropdownWrapper'
import { VaultsPanelNavigationWrapper } from '@/components/layout/VaultsPanelNavigationWrapper/VaultsPanelNavigationWrapper'
import { DashboardVaultHeader } from '@/features/dashboard/components/DashboardVaultHeader/DashboardVaultHeader'

import institutionVaultLayoutStyles from './InstitutionVaultLayout.module.css'

export default async function InstitutionVaultLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ institutionId: string; vaultId: string }>
}) {
  const { institutionId, vaultId } = await params
  const [institution, { vault }] = await Promise.all([
    getInstitutionData(institutionId),
    getVaultData(institutionId, vaultId),
  ])
  const selectedVault = vault

  return (
    <DashboardContentLayout
      panel={
        <div className={institutionVaultLayoutStyles.dashboardVaultsPanelWrapper}>
          <VaultsDropdownWrapper institution={institution} selectedVault={selectedVault} />
          <VaultsPanelNavigationWrapper
            institutionId={institutionId}
            selectedVaultId={selectedVault.id}
          />
        </div>
      }
      header={
        <DashboardVaultHeader
          vaultName={selectedVault.name}
          asset={selectedVault.asset}
          nav={selectedVault.nav}
          aum={selectedVault.aum}
          fee={selectedVault.fee}
          inception={selectedVault.inception}
        />
      }
    >
      {children}
    </DashboardContentLayout>
  )
}
