'use client'

import { type FC, useState } from 'react'
import { Icon, PanelNavigation } from '@summerfi/app-earn-ui'
import { type IconNamesList, type TokenSymbolsList } from '@summerfi/app-types'

import { DashboardContentLayout } from '@/components/layout/DashboardContentLayout/DashboardContentLayout'
import { DashboardVaultHeader } from '@/features/dashboard/components/DashboardVaultHeader/DashboardVaultHeader'
import { PanelActivity } from '@/features/panels/overview/components/PanelActivity/PanelActivity'
import { PanelAssetRelocation } from '@/features/panels/overview/components/PanelAssetRelocation/PanelAssetRelocation'
import { PanelClientAdmin } from '@/features/panels/overview/components/PanelClientAdmin/PanelClientAdmin'
import { PanelFeeRevenueAdmin } from '@/features/panels/overview/components/PanelFeeRevenueAdmin/PanelFeeRevenueAdmin'
import { PanelOverview } from '@/features/panels/overview/components/PanelOverview/PanelOverview'
import { PanelRiskParameters } from '@/features/panels/overview/components/PanelRiskParameters/PanelRiskParameters'
import { PanelRoleAdmin } from '@/features/panels/overview/components/PanelRoleAdmin/PanelRoleAdmin'
import { PanelVaultExposure } from '@/features/panels/overview/components/PanelVaultExposure/PanelVaultExposure'

interface IconWithTextProps {
  iconName?: IconNamesList
  tokenName?: TokenSymbolsList
  text: string
  size: number
}

enum DashboardOverviewPanel {
  OVERVIEW = 'overview',
  VAULT_EXPOSURE = 'vault-exposure',
  ASSET_RELOCATION = 'asset-relocation',
  RISK_PARAMETERS = 'risk-parameters',
  ROLE_ADMIN = 'role-admin',
  CLIENT_ADMIN = 'client-admin',
  FEE_REVENUE_ADMIN = 'fee-revenue-admin',
  ACTIVITY = 'activity',
}

const IconWithText: FC<IconWithTextProps> = ({ iconName, tokenName, text, size }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-x-small)' }}>
      {iconName && <Icon iconName={iconName} size={size} />}
      {tokenName && <Icon tokenName={tokenName} size={size} />}
      {text}
    </div>
  )
}

const panelItems = [
  {
    id: DashboardOverviewPanel.OVERVIEW,
    label: 'Overview',
  },
  {
    id: DashboardOverviewPanel.VAULT_EXPOSURE,
    label: 'Vault exposure',
  },
  {
    id: DashboardOverviewPanel.ASSET_RELOCATION,
    label: 'Asset rellocation',
  },
  {
    id: DashboardOverviewPanel.RISK_PARAMETERS,
    label: 'Risk Parameters',
  },
  {
    id: DashboardOverviewPanel.ROLE_ADMIN,
    label: 'Role admin',
  },
  {
    id: DashboardOverviewPanel.CLIENT_ADMIN,
    label: 'Client admin',
  },
  {
    id: DashboardOverviewPanel.FEE_REVENUE_ADMIN,
    label: 'Fee & revenue admin',
  },
  {
    id: DashboardOverviewPanel.ACTIVITY,
    label: 'Activity',
  },
]

interface DashboardOverviewProps {
  vaultData: {
    name: string
    asset: string
    nav: number
    aum: number
    fee: number
    inception: number
  }
}

export const DashboardOverview: FC<DashboardOverviewProps> = ({ vaultData }) => {
  const [activePanel, setActivePanel] = useState<DashboardOverviewPanel>(
    DashboardOverviewPanel.OVERVIEW,
  )

  const handlePanelChange = (panel: DashboardOverviewPanel) => {
    setActivePanel(panel)
  }

  const navigation = [
    {
      id: '1',
      label: <IconWithText tokenName="USDC" text="USDC-1" size={24} />,
      expanded: true,
      items: panelItems.map((item) => ({
        id: item.id,
        label: item.label,
        action: () => handlePanelChange(item.id),
        isActive: activePanel === item.id,
      })),
    },
  ]

  const panelsContent = {
    [DashboardOverviewPanel.OVERVIEW]: <PanelOverview />,
    [DashboardOverviewPanel.VAULT_EXPOSURE]: <PanelVaultExposure />,
    [DashboardOverviewPanel.ASSET_RELOCATION]: <PanelAssetRelocation />,
    [DashboardOverviewPanel.RISK_PARAMETERS]: <PanelRiskParameters />,
    [DashboardOverviewPanel.ROLE_ADMIN]: <PanelRoleAdmin />,
    [DashboardOverviewPanel.CLIENT_ADMIN]: <PanelClientAdmin />,
    [DashboardOverviewPanel.FEE_REVENUE_ADMIN]: <PanelFeeRevenueAdmin />,
    [DashboardOverviewPanel.ACTIVITY]: <PanelActivity />,
  }

  return (
    <DashboardContentLayout
      panel={
        <PanelNavigation
          navigation={navigation}
          staticItems={[
            {
              id: '1',
              label: <IconWithText iconName="plus" text="Request a new market" size={20} />,
              // eslint-disable-next-line no-console
              action: () => console.log('Request a new market'),
            },
            {
              id: '2',
              label: <IconWithText iconName="question_o" text="Help & Support" size={20} />,
              link: { href: '/', target: '_blank' },
            },
          ]}
        />
      }
      header={
        <DashboardVaultHeader
          name={vaultData.name}
          asset={vaultData.asset}
          nav={vaultData.nav}
          aum={vaultData.aum}
          fee={vaultData.fee}
          inception={vaultData.inception}
        />
      }
    >
      {panelsContent[activePanel]}
    </DashboardContentLayout>
  )
}
