'use client'

import { TabBarSimple } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { usePathname } from 'next/navigation'

import { getMainTabBarTabId } from '@/helpers/get-pathname-tab-id'
import { getInstitutionUrl, getInstitutionVaultUrl } from '@/helpers/get-url'

export const InstitutionTabBar = ({
  institutionName,
  defaultVault,
  tabBarStyle,
}: {
  institutionName: string
  defaultVault: SDKVaultishType
  tabBarStyle?: React.CSSProperties
}) => {
  const pathname = usePathname()

  const tabId = getMainTabBarTabId(pathname)

  return (
    <TabBarSimple
      activeTabId={tabId}
      tabBarStyle={tabBarStyle}
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          url: getInstitutionUrl({
            institutionName,
            tab: 'overview/institution',
          }),
        },
        {
          id: 'vaults',
          label: 'Vaults',
          url: getInstitutionVaultUrl({
            institutionName,
            vault: defaultVault,
          }),
        },
        // {
        //   id: 'risk',
        //   label: 'Risk',
        //   url: getInstitutionUrl({
        //     institutionName,
        //     tab: 'risk',
        //   }),
        // },
        // {
        //   id: 'fees-revenue',
        //   label: 'Fees & Revenue',
        //   url: getInstitutionUrl({
        //     institutionName,
        //     tab: 'fees-revenue',
        //   }),
        // },
        // {
        //   id: 'reports',
        //   label: 'Reports',
        //   url: getInstitutionUrl({
        //     institutionName,
        //     tab: 'reports',
        //   }),
        // },
        // {
        //   id: 'news',
        //   label: 'News',
        //   url: getInstitutionUrl({
        //     institutionName,
        //     tab: 'news',
        //   }),
        // },
      ]}
    />
  )
}
