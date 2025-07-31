'use client'

import { type FC, type ReactNode, useState } from 'react'
import { Dropdown, Icon, PanelNavigation, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import {
  type DropdownRawOption,
  type IconNamesList,
  type TokenSymbolsList,
} from '@summerfi/app-types'

import { DashboardContentLayout } from '@/components/layout/DashboardContentLayout/DashboardContentLayout'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { DashboardVaultHeader } from '@/features/dashboard/components/DashboardVaultHeader/DashboardVaultHeader'
import { PanelActivity } from '@/features/panels/vaults/components/PanelActivity/PanelActivity'
import { PanelAssetRelocation } from '@/features/panels/vaults/components/PanelAssetRelocation/PanelAssetRelocation'
import { PanelClientAdmin } from '@/features/panels/vaults/components/PanelClientAdmin/PanelClientAdmin'
import { PanelFeeRevenueAdmin } from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/PanelFeeRevenueAdmin'
import { PanelOverview } from '@/features/panels/vaults/components/PanelOverview/PanelOverview'
import { PanelRiskParameters } from '@/features/panels/vaults/components/PanelRiskParameters/PanelRiskParameters'
import { PanelRoleAdmin } from '@/features/panels/vaults/components/PanelRoleAdmin/PanelRoleAdmin'
import { PanelVaultExposure } from '@/features/panels/vaults/components/PanelVaultExposure/PanelVaultExposure'

import styles from './DashboardVaults.module.css'

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

interface IconWithTextProps {
  iconName?: IconNamesList
  tokenName?: TokenSymbolsList
  children: ReactNode
  size: number
}

const IconWithText: FC<IconWithTextProps> = ({ iconName, tokenName, children, size }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-x-small)' }}>
      {iconName && <Icon iconName={iconName} size={size} />}
      {tokenName && <Icon tokenName={tokenName} size={size} />}
      {children}
    </div>
  )
}

interface DropdownContentProps {
  children: ReactNode
}

const DropdownContent: FC<DropdownContentProps> = ({ children }) => {
  return (
    <IconWithText tokenName="USDC" size={24}>
      <Text as="p" variant="p1semi">
        {children}
      </Text>
    </IconWithText>
  )
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
    label: 'Asset rellocation',
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

interface DashboardVaultsProps {
  vaultData: {
    name: string
    asset: string
    nav: number
    aum: number
    fee: number
    inception: number
  }
}

export const DashboardVaults: FC<DashboardVaultsProps> = ({ vaultData }) => {
  // to be rather stored as param in url
  const [activePanel, setActivePanel] = useState<DashboardVaultsPanel>(
    DashboardVaultsPanel.OVERVIEW,
  )
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const vaultsOptions: DropdownRawOption[] = [
    {
      value: 'vault-1',
      content: <DropdownContent>USDC-1</DropdownContent>,
    },
    {
      value: 'vault-2',
      content: <DropdownContent>USDC-2</DropdownContent>,
    },
    {
      value: 'vault-3',
      content: <DropdownContent>USDC-3</DropdownContent>,
    },
  ]

  const [selectedVault, setSelectedVault] = useState<DropdownRawOption>(vaultsOptions[0])

  const handlePanelChange = (panel: DashboardVaultsPanel) => {
    setActivePanel(panel)
  }

  const navigation = [
    {
      id: '1',
      items: panelItems.map((item) => ({
        id: item.id,
        label: item.label,
        action: () => handlePanelChange(item.id),
        isActive: activePanel === item.id,
      })),
    },
  ]

  const panelsContent = {
    [DashboardVaultsPanel.OVERVIEW]: <PanelOverview />,
    [DashboardVaultsPanel.VAULT_EXPOSURE]: <PanelVaultExposure />,
    [DashboardVaultsPanel.ASSET_RELOCATION]: <PanelAssetRelocation />,
    [DashboardVaultsPanel.RISK_PARAMETERS]: <PanelRiskParameters />,
    [DashboardVaultsPanel.ROLE_ADMIN]: <PanelRoleAdmin />,
    [DashboardVaultsPanel.CLIENT_ADMIN]: <PanelClientAdmin />,
    [DashboardVaultsPanel.FEE_REVENUE_ADMIN]: <PanelFeeRevenueAdmin />,
    [DashboardVaultsPanel.ACTIVITY]: <PanelActivity />,
  }

  return (
    <DashboardContentLayout
      panel={
        <div className={styles.dashboardVaultsPanelWrapper}>
          <Dropdown
            options={vaultsOptions}
            dropdownValue={selectedVault}
            onChange={setSelectedVault}
            dropdownWrapperClassName={styles.dropdownWrapper}
            dropdownSelectedClassName={styles.dropdownSelected}
            asCard
          >
            {selectedVault.content}
          </Dropdown>
          <PanelNavigation
            isMobile={isMobile}
            navigation={navigation}
            staticItems={[
              {
                id: '1',
                label: (
                  <IconWithText iconName="plus" size={20}>
                    Request a new market
                  </IconWithText>
                ),
                // eslint-disable-next-line no-console
                action: () => console.log('Request a new market'),
              },
              {
                id: '2',
                label: (
                  <IconWithText iconName="question_o" size={20}>
                    Help & Support
                  </IconWithText>
                ),
                link: { href: '/', target: '_blank' },
              },
            ]}
          />
        </div>
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
