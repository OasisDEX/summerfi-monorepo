'use client'

import { PanelNavigation, useMobileCheck } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { usePathname, useRouter } from 'next/navigation'

import { panelNavigationStaticItems } from '@/constants/panel-navigation-static-items'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { getPanelVaultNavigationTabId } from '@/helpers/get-pathname-tab-id'
import { getInstitutionVaultUrl } from '@/helpers/get-url'

enum DashboardVaultsPanel {
  OVERVIEW = 'overview',
  VAULT_EXPOSURE = 'vault-exposure',
  ASSET_RELOCATION = 'asset-relocation',
  RISK_PARAMETERS = 'risk-parameters',
  ROLE_ADMIN = 'role-admin',
  CLIENT_ADMIN = 'client-admin',
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
    id: DashboardVaultsPanel.ASSET_RELOCATION,
    label: 'Asset relocation',
  },
  {
    id: DashboardVaultsPanel.RISK_PARAMETERS,
    label: 'Risk Parameters',
  },
  {
    id: DashboardVaultsPanel.ROLE_ADMIN,
    label: 'Role admin',
  },
  {
    id: DashboardVaultsPanel.CLIENT_ADMIN,
    label: 'Client admin',
  },
  {
    id: DashboardVaultsPanel.FEE_REVENUE_ADMIN,
    label: 'Fee & revenue admin',
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
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const { push } = useRouter()
  const pathname = usePathname()
  const panelNavigationTabId = getPanelVaultNavigationTabId(pathname)

  const navigation = [
    {
      id: '1',
      items: panelItems.map((item) => ({
        id: item.id,
        label: item.label,
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

  return (
    <PanelNavigation
      isMobile={isMobile}
      navigation={navigation}
      staticItems={panelNavigationStaticItems}
    />
  )
}
