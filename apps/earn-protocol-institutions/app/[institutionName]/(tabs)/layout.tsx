import { type ReactNode, Suspense } from 'react'

import {
  InstitutionTabsHeader,
  InstitutionTabsHeaderSkeleton,
} from '@/app/[institutionName]/(tabs)/InstitutionTabsHeader'

// Layout body stays cheap (only awaits params) so the active tab's content (with its own
// loading.tsx) can render in parallel; the stats strip + tab bar stream in via Suspense.
export default async function InstitutionTabLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ institutionName: string }>
}) {
  const { institutionName } = await params

  if (!institutionName) {
    return <div>Institution not found.</div>
  }

  return (
    <>
      <Suspense fallback={<InstitutionTabsHeaderSkeleton />}>
        <InstitutionTabsHeader institutionName={institutionName} />
      </Suspense>
      <div style={{ padding: 'var(--general-space-24) 0' }}>{children}</div>
    </>
  )
}
