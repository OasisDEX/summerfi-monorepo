'use client'

import { TabBarSimple } from '@summerfi/app-earn-ui'
import { usePathname } from 'next/navigation'

export const InstitutionTabBar = ({ institutionId }: { institutionId: string }) => {
  const pathname = usePathname()

  const tabId = pathname.split('/')[2] ?? 'overview'

  return (
    <TabBarSimple
      activeTabId={tabId}
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          url: `/${institutionId}/overview`,
        },
        {
          id: 'vaults',
          label: 'Vaults',
          url: `/${institutionId}/vaults`,
        },
        {
          id: 'risk',
          label: 'Risk',
          url: `/${institutionId}/risk`,
        },
        {
          id: 'fees-revenue',
          label: 'Fees & Revenue',
          url: `/${institutionId}/fees-revenue`,
        },
        {
          id: 'reports',
          label: 'Reports',
          url: `/${institutionId}/reports`,
        },
        {
          id: 'news',
          label: 'News',
          url: `/${institutionId}/news`,
        },
      ]}
    />
  )
}
