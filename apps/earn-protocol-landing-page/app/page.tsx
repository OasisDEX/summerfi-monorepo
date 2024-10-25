import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { LandingPageContent } from '@/components/layout/LandingPageContent/LandingPageContent'

export const revalidate = 60

export default async function HomePage() {
  const { vaults, callDataTimestamp } = await getVaultsList()

  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <LandingPageContent strategiesList={vaults} />
      <pre
        style={{
          backgroundColor: 'rgba(30,30,30,0.5)',
          backdropFilter: 'blur(30px)',
          color: 'rgba(180,180,180,1)',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
          width: '100%',
          whiteSpace: 'pre-wrap',
          marginTop: '20px',
        }}
      >
        {JSON.stringify(
          { dataTimestamp: callDataTimestamp, secondsAgo: (Date.now() - callDataTimestamp) / 1000 },
          null,
          2,
        )}
      </pre>
    </div>
  )
}
