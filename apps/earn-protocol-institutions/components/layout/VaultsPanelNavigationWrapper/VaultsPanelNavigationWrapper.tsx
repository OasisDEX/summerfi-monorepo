'use client'

import { type SDKVaultishType } from '@summerfi/app-types'
import { usePathname, useRouter } from 'next/navigation'

import { NavigationIntermediary } from '@/components/layout/Navigation/NavigationIntermediary'
import { getPanelVaultNavigationTabId } from '@/helpers/get-pathname-tab-id'
import { getInstitutionVaultUrl } from '@/helpers/get-url'

enum DashboardVaultsPanel {
  OVERVIEW = 'overview',
  VAULT_EXPOSURE = 'vault-exposure',
  ASSET_REALLOCATION = 'asset-reallocation',
  ASSET_MANAGEMENT = 'asset-management',
  RISK_PARAMETERS = 'risk-parameters',
  ROLE_ADMIN = 'role-admin',
  USER_ADMIN = 'user-admin',
  FEE_REVENUE_ADMIN = 'fee-revenue-admin',
  ACTIVITY = 'activity',
}

const panelItems = [
  {
    id: DashboardVaultsPanel.OVERVIEW,
    label: 'Overview',
  },
  {
    id: DashboardVaultsPanel.VAULT_EXPOSURE,
    label: 'Vault exposure',
  },
  {
    id: DashboardVaultsPanel.RISK_PARAMETERS,
    label: 'Risk Parameters',
  },
  {
    id: DashboardVaultsPanel.FEE_REVENUE_ADMIN,
    label: 'Fee & revenue admin',
  },
  {
    id: DashboardVaultsPanel.ASSET_REALLOCATION,
    label: 'Asset reallocation',
    disabled: true,
  },
  {
    id: DashboardVaultsPanel.ASSET_MANAGEMENT,
    label: 'Asset management',
  },
  {
    id: DashboardVaultsPanel.ROLE_ADMIN,
    label: 'Role admin',
  },
  {
    id: DashboardVaultsPanel.USER_ADMIN,
    label: 'User admin',
  },
  {
    id: DashboardVaultsPanel.ACTIVITY,
    label: 'Activity',
  },
]

export const VaultsPanelNavigationWrapper = ({
  selectedVault,
  institutionName,
}: {
  selectedVault: SDKVaultishType
  institutionName: string
}) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const panelNavigationTabId = getPanelVaultNavigationTabId(pathname)

  const navigation = [
    {
      id: '1',
      items: panelItems.map((item) => ({
        id: item.id,
        label: item.label,
        disabled: item.disabled,
        action: () => {
          push(
            getInstitutionVaultUrl({
              institutionName,
              vault: selectedVault,
              page: item.id,
            }),
          )
        },
        isActive: panelNavigationTabId === item.id,
      })),
    },
  ]

  return <NavigationIntermediary navigation={navigation} />
}
