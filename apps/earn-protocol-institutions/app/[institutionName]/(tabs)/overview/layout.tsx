import { type ReactNode } from 'react'

import { getInstitutionData } from '@/app/server-handlers/institution/institution-data'
import { DashboardContentLayout } from '@/components/layout/DashboardContentLayout/DashboardContentLayout'
import { OverviewPanelNavigationWrapper } from '@/components/layout/VaultsOverviewNavigationWrapper/VaultsOverviewNavigationWrapper'

export default async function InstitutionOverviewLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ institutionName: string }>
}) {
  const { institutionName } = await params
  const [institutionData] = await Promise.all([getInstitutionData(institutionName)])

  if (!institutionName) {
    return <div>Institution ID not provided.</div>
  }

  if (!institutionData) {
    return <div>Institution not found.</div>
  }

  return (
    <DashboardContentLayout
      panel={<OverviewPanelNavigationWrapper institutionName={institutionName} />}
    >
      {children}
    </DashboardContentLayout>
  )
}
