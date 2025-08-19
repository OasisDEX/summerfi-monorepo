'use client'

import { TabBarSimple } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { usePathname } from 'next/navigation'

import { getMainTabBarTabId } from '@/helpers/get-pathname-tab-id'
import { getInstitutionUrl, getInstitutionVaultUrl } from '@/helpers/get-url'

export const InstitutionTabBar = ({
  institutionId,
  defaultVault,
}: {
  institutionId: string
  defaultVault: SDKVaultishType
}) => {
  const pathname = usePathname()

  const tabId = getMainTabBarTabId(pathname)

  return (
    <TabBarSimple
      activeTabId={tabId}
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          url: getInstitutionUrl({
            institutionId,
            tab: 'overview',
          }),
        },
        {
          id: 'vaults',
          label: 'Vaults',
          url: getInstitutionVaultUrl({
            institutionId,
            vault: defaultVault,
          }),
        },
        {
          id: 'risk',
          label: 'Risk',
          url: getInstitutionUrl({
            institutionId,
            tab: 'risk',
          }),
        },
        {
          id: 'fees-revenue',
          label: 'Fees & Revenue',
          url: getInstitutionUrl({
            institutionId,
            tab: 'fees-revenue',
          }),
        },
        {
          id: 'reports',
          label: 'Reports',
          url: getInstitutionUrl({
            institutionId,
            tab: 'reports',
          }),
        },
        {
          id: 'news',
          label: 'News',
          url: getInstitutionUrl({
            institutionId,
            tab: 'news',
          }),
        },
      ]}
    />
  )
}
