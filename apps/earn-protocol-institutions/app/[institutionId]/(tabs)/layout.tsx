import { getInstitutionData } from '@/app/server-handlers/institution-data'
import { InstitutionTabBar } from '@/components/layout/TabBar/InstitutionTabBar'

export default async function InstitutionTabFeesRevenueLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ institutionId: string }>
}) {
  const [{ institutionId }] = await Promise.all([params])
  const [institution] = await Promise.all([getInstitutionData(institutionId)])

  return (
    <>
      <InstitutionTabBar
        institutionId={institutionId}
        defaultVaultId={institution.vaultsData[0].id}
      />
      <div style={{ padding: 'var(--general-space-24) 0' }}>{children}</div>
    </>
  )
}
