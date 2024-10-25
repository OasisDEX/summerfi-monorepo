import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { StrategiesListView } from '@/components/layout/StrategiesListView/StrategiesListView'

export const revalidate = 60

const EarnAllStrategiesPage = async () => {
  const { vaults, callDataTimestamp } = await getVaultsList()

  return (
    <>
      <StrategiesListView strategiesList={vaults} />
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
    </>
  )
}

export default EarnAllStrategiesPage
