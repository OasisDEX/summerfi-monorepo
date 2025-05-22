import { useState } from 'react'
import { Card, Icon, TabBar, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { BeachClubSteps } from '@/features/beach-club/components/BeachClubSteps/BeachClubSteps'

import classNames from './BeachClubReferAndEarn.module.css'

enum ReferAndEarnTab {
  HOW_IT_WORKS = 'how_it_works',
  TRACK_REFERRALS = 'track_referrals',
}

const tabsOptions = [
  {
    label: 'How it works',
    id: ReferAndEarnTab.HOW_IT_WORKS,
    content: (
      <div>
        <Text
          as="p"
          variant="p2"
          style={{
            color: 'var(--earn-protocol-secondary-60)',
            marginBottom: 'var(--general-space-16)',
          }}
        >
          The Summer Earn Protocol is a permissionless passive lending product, which sets out to
          offer effortless and secure optimised yield.
        </Text>
        <Link href="/" target="_blank">
          <WithArrow as="p" variant="p3semi" style={{ color: 'var(--beach-club-link)' }}>
            Read the details
          </WithArrow>
        </Link>
        <div style={{ marginTop: 'var(--general-space-24)' }}>
          <BeachClubSteps />
        </div>
      </div>
    ),
  },
  {
    label: 'Track referrals',
    id: ReferAndEarnTab.TRACK_REFERRALS,
    content: <div>Track referrals</div>,
  },
]

export const BeachClubReferAndEarn = () => {
  const [tab, setTab] = useState<ReferAndEarnTab>(ReferAndEarnTab.HOW_IT_WORKS)

  return (
    <div className={classNames.beachClubReferAndEarnWrapper}>
      <div className={classNames.header}>
        <Text
          as="div"
          variant="h4"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-16)' }}
        >
          <Icon iconName="users_beach_club" size={48} /> Refer and earn
        </Text>
      </div>
      <Card variant="cardSecondary">
        {/* <div className={classNames.tabsContainer}>
          {tabsOptions.map((item) => (
            <Text
              as="h5"
              variant="h5"
              key={item.value}
              onClick={() => setTab(item.value)}
              className={tab === item.value ? classNames.tabActive : classNames.tab}
              //   style={{
              //     color:
              //       tab === item.value
              //         ? 'var(--earn-protocol-secondary-100)'
              //         : 'var(--earn-protocol-secondary-40)',
              //   }}
            >
              {item.label}
            </Text>
          ))}
        </div> */}
        <TabBar
          tabs={tabsOptions}
          textVariant="p3semi"
          tabHeadersStyle={{ borderBottom: '1px solid var(--earn-protocol-neutral-80)' }}
        />
      </Card>
    </div>
  )
}
