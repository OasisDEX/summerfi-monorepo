import { useState } from 'react'
import {
  BeachClubSteps,
  Button,
  CopyToClipboard,
  getTwitterShareUrl,
  Icon,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import Link from 'next/link'

import classNames from './BeachClubHowItWorks.module.css'

export const BeachClubHowItWorks = () => {
  const [referralCode, setReferralCode] = useState('')

  const handleGenerateReferralCode = () => {
    setReferralCode('2000000')
  }

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
  }

  return (
    <div className={classNames.referralCodeWrapper}>
      <Text
        as="p"
        variant="p2"
        style={{
          color: 'var(--earn-protocol-secondary-60)',
          marginBottom: 'var(--general-space-16)',
          width: '100%',
          textAlign: 'left',
        }}
      >
        The Summer Earn Protocol is a permissionless passive lending product, which sets out to
        offer effortless and secure optimised yield.
      </Text>
      <Link href="/" target="_blank" style={{ width: '100%', textAlign: 'left' }}>
        <WithArrow as="p" variant="p3semi" style={{ color: 'var(--beach-club-link)' }}>
          Read the details
        </WithArrow>
      </Link>
      <div
        style={{
          marginTop: 'var(--general-space-24)',
          marginBottom: 'var(--general-space-32)',
          width: '100%',
        }}
      >
        <BeachClubSteps />
      </div>
      {!referralCode && (
        <Text
          as="h5"
          variant="h5"
          style={{
            color: 'var(--earn-protocol-secondary-60)',
            textAlign: 'center',
            marginBottom: 'var(--general-space-16)',
          }}
        >
          Generate your unique referral code
        </Text>
      )}
      {referralCode ? (
        <div className={classNames.referralWrapper}>
          <div className={classNames.referralCode}>
            <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-70)' }}>
              {referralCode}
            </Text>
            <CopyToClipboard textToCopy={referralCode}>
              <Text
                as="p"
                variant="p1semi"
                className={classNames.copyWrapper}
                onClick={handleCopyReferralCode}
              >
                Copy
              </Text>
            </CopyToClipboard>
          </div>
          <div className={classNames.socialMediaWrapper}>
            <Link
              href={getTwitterShareUrl({
                url: window.location.href,
                text: `Here's my Summer Earn Protocol referral code: ${referralCode} 🎉. Use it to earn more!`,
              })}
              target="_blank"
              className={classNames.socialMediaLink}
            >
              <Icon iconName="social_x_beach_club" size={45} />
            </Link>
            {/* <Link href="/">
              <Icon iconName="social_link_beach_club" size={45} />
            </Link> */}
          </div>
        </div>
      ) : (
        <Button
          variant="beachClubLarge"
          style={{
            maxWidth: '148px',
            minWidth: 'unset',
          }}
          onClick={handleGenerateReferralCode}
        >
          Generate <Icon iconName="stars" size={20} />
        </Button>
      )}
    </div>
  )
}
