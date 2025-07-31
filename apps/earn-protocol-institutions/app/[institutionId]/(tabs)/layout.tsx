import { InstitutionTabBar } from '@/components/layout/TabBar/InstitutionTabBar'

export default async function InstitutionTabFeesRevenueLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ institutionId: string }>
}) {
  const [{ institutionId }] = await Promise.all([params])

  return (
    <>
      <InstitutionTabBar institutionId={institutionId} />
      <div style={{ padding: 'var(--general-space-24) 0' }}>{children}</div>
    </>
  )
}
