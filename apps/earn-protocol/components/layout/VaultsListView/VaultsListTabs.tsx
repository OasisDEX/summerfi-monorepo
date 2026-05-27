'use client'

import { Emphasis, TabBar } from '@summerfi/app-earn-ui'

type VaultsListTabsProps = {
  rwaVaultsEnabled: boolean
  isPermissionedRwaTab: boolean
  filterVaults: string[]
  onTabChange: (tabId: string) => void
}

export const VaultsListTabs = ({
  rwaVaultsEnabled,
  isPermissionedRwaTab,
  filterVaults,
  onTabChange,
}: VaultsListTabsProps) => {
  return (
    <TabBar
      tabs={
        rwaVaultsEnabled
          ? [
              {
                id: 'defi-vaults',
                label: 'DeFi Vaults',
              },
              {
                id: 'permissioned-rwa-vaults',
                label: 'Permissioned RWA Vaults',
              },
            ]
          : [
              {
                id: 'risk-managed',
                label: 'Risk-Managed By BlockAnalitica',
              },
              {
                id: 'dao-risk-managed',
                label: (
                  <>
                    DAO Risk-Managed <Emphasis variant="p3semiColorful">New!</Emphasis>
                  </>
                ),
              },
            ]
      }
      handleTabChange={(tab) => {
        onTabChange(tab.id)
      }}
      defaultIndex={
        rwaVaultsEnabled
          ? isPermissionedRwaTab
            ? 1
            : 0
          : filterVaults.includes('dao-risk-managed')
            ? 1
            : filterVaults.includes('risk-managed')
              ? 0
              : 0
      }
      tabContentStyle={{
        padding: 0,
      }}
      wrapperStyle={{
        padding: '0 30px',
      }}
      tabHeadersStyle={{
        borderBottom: 'none',
      }}
      useAsControlled
    />
  )
}
