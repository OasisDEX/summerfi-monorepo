import { type FC } from 'react'
import { parseQueryStringServerSide } from '@summerfi/app-utils'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { getRebalances } from '@/app/server-handlers/sdk/getRebalances'
import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { RebalanceActivityView } from '@/features/rebalance-activity/components/RebalanceActivityView/RebalanceActivityView'

export const revalidate = 60

interface RebalanceActivityPageProps {
  searchParams: ReadonlyURLSearchParams
}

const RebalanceActivityPage: FC<RebalanceActivityPageProps> = async ({ searchParams }) => {
  const [{ vaults }, { rebalances }] = await Promise.all([
    await getVaultsList(),
    await getRebalances(),
  ])

  return (
    <RebalanceActivityView
      vaultsList={vaults}
      rebalancesList={rebalances}
      searchParams={parseQueryStringServerSide({ searchParams })}
    />
  )
}

export default RebalanceActivityPage
