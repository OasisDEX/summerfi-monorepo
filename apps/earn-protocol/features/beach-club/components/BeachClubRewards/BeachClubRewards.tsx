import { type Dispatch, type FC, useMemo } from 'react'
import { Card, Icon, TabBar, Text } from '@summerfi/app-earn-ui'
import { slugify } from '@summerfi/app-utils'

import { type BeachClubData } from '@/app/server-handlers/raw-calls/beach-club/types'
import { BeachClubBoatChallenge } from '@/features/beach-club/components/BeachClubBoatChallenge/BeachClubBoatChallenge'
import { BeachClubTvlChallenge } from '@/features/beach-club/components/BeachClubTvlChallenge/BeachClubTvlChallenge'
import { type BeachClubReducerAction, type BeachClubState } from '@/features/beach-club/types'
import { type MerklIsAuthorizedPerChain } from '@/features/claim-and-delegate/types'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'

import classNames from './BeachClubRewards.module.css'

enum ReferAndEarnTab {
  TVL_CHALLENGES = 'tvl_challenges',
  BEACH_BOAT_CHALLENGE = 'beach_boat_challenge',
}

interface BeachClubRewardsProps {
  beachClubData: BeachClubData
  walletAddress: string
  merklIsAuthorizedPerChain: MerklIsAuthorizedPerChain
  state: BeachClubState
  dispatch: Dispatch<BeachClubReducerAction>
}

export const BeachClubRewards: FC<BeachClubRewardsProps> = ({
  beachClubData,
  walletAddress,
  merklIsAuthorizedPerChain,
  state,
  dispatch,
}) => {
  const tabsOptions = useMemo(
    () => [
      {
        label: 'TVL Challenges',
        id: ReferAndEarnTab.TVL_CHALLENGES,
        content: (
          <BeachClubTvlChallenge
            beachClubData={beachClubData}
            merklIsAuthorizedPerChain={merklIsAuthorizedPerChain}
            state={state}
            dispatch={dispatch}
          />
        ),
        activeColor: 'var(--beach-club-tab-underline)',
      },
      {
        label: 'Beach Boat Challenge',
        id: ReferAndEarnTab.BEACH_BOAT_CHALLENGE,
        content: (
          <BeachClubBoatChallenge beachClubData={beachClubData} walletAddress={walletAddress} />
        ),
        activeColor: 'var(--beach-club-tab-underline)',
      },
    ],
    [beachClubData, walletAddress, merklIsAuthorizedPerChain, state, dispatch],
  )
  const handleButtonClick = useHandleButtonClickEvent()

  const handleTabChange = (tab: { id: string }) => {
    handleButtonClick(`portfolio-beach-club-rewards-tab-${slugify(tab.id)}`)
  }

  return (
    <div className={classNames.beachClubRewardsWrapper}>
      <div className={classNames.header}>
        <Text
          as="div"
          variant="h4"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-16)' }}
        >
          <Icon iconName="beach_club_rewards" size={48} /> Beach Club Rewards
        </Text>
      </div>
      <Card variant="cardSecondary">
        <TabBar
          tabs={tabsOptions}
          textVariant="p3semi"
          tabHeadersStyle={{ borderBottom: '1px solid var(--earn-protocol-neutral-80)' }}
          handleTabChange={handleTabChange}
        />
      </Card>
    </div>
  )
}
