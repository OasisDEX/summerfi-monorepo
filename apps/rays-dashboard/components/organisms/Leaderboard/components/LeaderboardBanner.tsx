'use client'
import { Button, EXTERNAL_LINKS, ProxyLinkComponent, Text } from '@summerfi/app-ui'

import { trackButtonClick } from '@/helpers/mixpanel'

const bannerLabels = ['Enable Automations', 'Open a position', 'Use Swap']

export const LeaderboardBanner = ({
  userWalletAddress,
  page,
}: {
  userWalletAddress?: string
  page: string
}) => {
  const bannerLink = userWalletAddress
    ? `/portfolio/${userWalletAddress}`
    : EXTERNAL_LINKS.KB.READ_ABOUT_RAYS

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        rowGap: '16px',
        background: 'linear-gradient(92deg, #fff3ef 0.78%, #f2fcff 99.57%)',
        padding: '16px',
        borderRadius: '16px',
      }}
    >
      <Text as="h5" variant="h5">
        How do I move up the leaderboard?
      </Text>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: '24px',
        }}
      >
        {bannerLabels.map((label) => (
          <ProxyLinkComponent
            key={label}
            style={{ color: 'var(--color-neutral-80)' }}
            target="_blank"
            href={bannerLink}
          >
            <Button
              variant="neutralSmall"
              onClick={() => {
                trackButtonClick({
                  id: 'LeaderboardBanner',
                  label,
                  page,
                })
              }}
            >
              {label}
            </Button>
          </ProxyLinkComponent>
        ))}
      </div>
    </div>
  )
}
