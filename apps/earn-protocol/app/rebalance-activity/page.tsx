import { type FC } from 'react'
import { parseQueryStringServerSide } from '@summerfi/app-utils'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { getGlobalRebalances } from '@/app/server-handlers/sdk/get-global-rebalances'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { RebalanceActivityView } from '@/features/rebalance-activity/components/RebalanceActivityView/RebalanceActivityView'

export const revalidate = 60

interface RebalanceActivityPageProps {
  searchParams: ReadonlyURLSearchParams
}

const RebalanceActivityPage: FC<RebalanceActivityPageProps> = async ({ searchParams }) => {
  const [{ vaults }, { rebalances }] = await Promise.all([getVaultsList(), getGlobalRebalances()])

  return (
    <RebalanceActivityView
      vaultsList={vaults}
      rebalancesList={rebalances}
      searchParams={parseQueryStringServerSide({ searchParams })}
    />
  )
}

export default RebalanceActivityPage