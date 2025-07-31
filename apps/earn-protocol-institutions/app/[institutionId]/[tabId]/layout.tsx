import { TabBarSimple } from '@summerfi/app-earn-ui'

export default async function InstitutionTabLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { institutionId: string; tabId: string }
}) {
  const [{ institutionId, tabId }] = await Promise.all([params])

  return (
    <>
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
      <div style={{ padding: 'var(--general-space-24) 0' }}>{children}</div>
    </>
  )
}
