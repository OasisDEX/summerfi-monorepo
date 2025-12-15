import { type Dispatch, type FC } from 'react'
import { Text } from '@summerfi/app-earn-ui'

import { type BeachClubData } from '@/app/server-handlers/raw-calls/beach-club/types'
import { BeachClubBigBanner } from '@/features/beach-club/components/BeachClubBigBannner/BeachClubBigBanner'
import { BeachClubReferAndEarn } from '@/features/beach-club/components/BeachClubReferAndEarn/BeachClubReferAndEarn'
import { BeachClubRewards } from '@/features/beach-club/components/BeachClubRewards/BeachClubRewards'
import { type BeachClubReducerAction, type BeachClubState } from '@/features/beach-club/types'
import { type MerklIsAuthorizedPerChain } from '@/features/claim-and-delegate/types'

import classNames from './PortfolioBeachClub.module.css'

interface PortfolioBeachClubProps {
  walletAddress: string
  beachClubData: BeachClubData
  merklIsAuthorizedPerChain: MerklIsAuthorizedPerChain
  state: BeachClubState
  dispatch: Dispatch<BeachClubReducerAction>
}

export const PortfolioBeachClub: FC<PortfolioBeachClubProps> = ({
  walletAddress,
  beachClubData,
  merklIsAuthorizedPerChain,
  state,
  dispatch,
}) => {
  return (
    <div className={classNames.beachClubWrapper}>
      <Text as="h3" variant="h3" style={{ marginTop: 'var(--general-space-16)' }}>
        Unlock exclusive rewards with Lazy Summer Beach Club.
      </Text>
      <Text as="h3" variant="h3colorfulBeachClub" style={{ marginBottom: '80px' }}>
        The more you share the more you earn.
      </Text>
      <BeachClubBigBanner />
      <BeachClubReferAndEarn walletAddress={walletAddress} beachClubData={beachClubData} />
      <BeachClubRewards
        beachClubData={beachClubData}
        walletAddress={walletAddress}
        merklIsAuthorizedPerChain={merklIsAuthorizedPerChain}
        state={state}
        dispatch={dispatch}
      />
    </div>
  )
}
