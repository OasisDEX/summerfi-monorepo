import { type SDKNetwork } from '@summerfi/app-types'

import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { StrategiesListView } from '@/components/layout/StrategiesListView/StrategiesListView'

type EarnNetworkStrategiesPageProps = {
  params: {
    network: SDKNetwork | 'all-networks'
  }
}

export const revalidate = 60

const EarnNetworkStrategiesPage = async ({ params }: EarnNetworkStrategiesPageProps) => {
  const { vaults, callDataTimestamp } = await getVaultsList()

  return (
    <>
      <StrategiesListView strategiesList={vaults} selectedNetwork={params.network} />
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

export default EarnNetworkStrategiesPage
