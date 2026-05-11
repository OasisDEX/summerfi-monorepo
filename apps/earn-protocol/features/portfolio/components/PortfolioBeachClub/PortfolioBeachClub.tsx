import { type Dispatch, type FC } from 'react'
import { Text } from '@summerfi/app-earn-ui'

import { useBeachClubUserDataQuery } from '@/features/beach-club/api/get-beach-club-user-data'
import { BeachClubBigBanner } from '@/features/beach-club/components/BeachClubBigBannner/BeachClubBigBanner'
import { BeachClubReferAndEarn } from '@/features/beach-club/components/BeachClubReferAndEarn/BeachClubReferAndEarn'
import { BeachClubRewards } from '@/features/beach-club/components/BeachClubRewards/BeachClubRewards'
import { type BeachClubReducerAction, type BeachClubState } from '@/features/beach-club/types'
import { type MerklIsAuthorizedPerChain } from '@/features/claim-and-delegate/types'

import classNames from './PortfolioBeachClub.module.css'

interface PortfolioBeachClubProps {
  viewWalletAddress: string
  merklIsAuthorizedPerChain: MerklIsAuthorizedPerChain
  state: BeachClubState
  dispatch: Dispatch<BeachClubReducerAction>
}

export const PortfolioBeachClub: FC<PortfolioBeachClubProps> = ({
  viewWalletAddress,
  merklIsAuthorizedPerChain,
  state,
  dispatch,
}) => {
  const { data: beachClubData, isError } = useBeachClubUserDataQuery(viewWalletAddress)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (isError) {
    return (
      <div className={classNames.beachClubWrapper}>
        <Text as="h3" variant="h3" style={{ marginTop: 'var(--general-space-16)' }}>
          Beach Club data is temporarily unavailable.
        </Text>
        <Text as="p" variant="p2" style={{ marginTop: 'var(--general-space-8)' }}>
          The rest of your portfolio is still available.
        </Text>
      </div>
    )
  }

  return (
    <div className={classNames.beachClubWrapper}>
      <Text as="h3" variant="h3" style={{ marginTop: 'var(--general-space-16)' }}>
        Unlock exclusive rewards with Lazy Summer Beach Club.
      </Text>
      <Text as="h3" variant="h3colorfulBeachClub" style={{ marginBottom: '80px' }}>
        The more you share the more you earn.
      </Text>
      <BeachClubBigBanner />
      <BeachClubReferAndEarn viewWalletAddress={viewWalletAddress} beachClubData={beachClubData} />
      <BeachClubRewards
        beachClubData={beachClubData}
        viewWalletAddress={viewWalletAddress}
        merklIsAuthorizedPerChain={merklIsAuthorizedPerChain}
        state={state}
        dispatch={dispatch}
      />
    </div>
  )
}
