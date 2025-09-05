import { type FC, useState } from 'react'
import { toast } from 'react-toastify'
import {
  BeachClubSteps,
  Button,
  CopyToClipboard,
  ERROR_TOAST_CONFIG,
  EXTERNAL_LINKS,
  getTwitterShareUrl,
  Icon,
  INTERNAL_LINKS,
  Text,
  useUserWallet,
  WithArrow,
} from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { type BeachClubData } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'

import classNames from './BeachClubHowItWorks.module.css'

interface BeachClubHowItWorksProps {
  beachClubData: BeachClubData
  walletAddress: string
}

export const BeachClubHowItWorks: FC<BeachClubHowItWorksProps> = ({
  beachClubData,
  walletAddress,
}) => {
  const resolvedInitReferralCode = beachClubData.custom_code ?? beachClubData.referral_code
  const { userWalletAddress } = useUserWallet()
  const [refCode, setRefCode] = useState(resolvedInitReferralCode)
  const [isLoading, setIsLoading] = useState(false)
  const handleButtonClick = useHandleButtonClickEvent()

  const isOwner = userWalletAddress?.toLowerCase() === walletAddress.toLowerCase()

  const handleGenerateReferralCode = async () => {
    try {
      if (!isOwner) {
        return
      }
      handleButtonClick(`portfolio-beach-club-refer-and-earn-how-it-works-generate-code`)

      setIsLoading(true)
      const response = await fetch(`/earn/api/beach-club/generate-code/${walletAddress}`, {
        method: 'POST',
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error, ERROR_TOAST_CONFIG)

        return
      }

      setRefCode(data.referralCode)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error generating referral code', error)
      toast.error('Error generating referral code, please contact support', ERROR_TOAST_CONFIG)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={classNames.referralCodeWrapper}>
      <Text as="p" variant="p2" className={classNames.description}>
        Lazy Summer Beach Club rewards users based on the amount of TVL and unique users that they
        can onboard into the protocol - $SUMR, Revenue sharing based on fee’s and exclusive merch
        can all be earned.
      </Text>
      <Link
        href="https://blog.summer.fi/introducing-summer-fi-beach-club-earn-big-rewards-for-sharing"
        target="_blank"
        style={{ width: '100%', textAlign: 'left' }}
        onClick={() => {
          handleButtonClick(`portfolio-beach-club-refer-and-earn-how-it-works-read-details`)
        }}
      >
        <WithArrow as="p" variant="p3semi" style={{ color: 'var(--beach-club-link)' }}>
          Read the details
        </WithArrow>
      </Link>
      <div className={classNames.stepsWrapper}>
        <BeachClubSteps />
      </div>
      {!refCode && (
        <>
          <Text as="h5" variant="h5" className={classNames.generateCode}>
            Generate your unique referral code
          </Text>
          <Text as="p" variant="p3" className={classNames.generateCodeDescription}>
            By generating the code, you accept the{' '}
            <Link
              href={INTERNAL_LINKS.tempTerms}
              target="_blank"
              style={{ display: 'inline', color: 'var(--beach-club-link)' }}
              onClick={() => {
                handleButtonClick(
                  `portfolio-beach-club-refer-and-earn-how-it-works-terms-of-service`,
                )
              }}
            >
              terms of service
            </Link>
            . If you want to generate a custom code, please contact us on{' '}
            <Link
              href={EXTERNAL_LINKS.DISCORD}
              style={{ display: 'inline', color: 'var(--beach-club-link)' }}
              target="_blank"
              onClick={() => {
                handleButtonClick(`portfolio-beach-club-refer-and-earn-how-it-works-discord`)
              }}
            >
              <WithArrow
                as="span"
                variant="p3semi"
                style={{
                  color: 'var(--beach-club-link)',
                  display: 'inline',
                }}
                wrapperStyle={{
                  display: 'inline',
                }}
              >
                discord
              </WithArrow>
            </Link>
          </Text>
        </>
      )}
      {refCode ? (
        <div className={classNames.referralSection}>
          <div className={classNames.referralWrapper}>
            <div className={classNames.referralCode}>
              <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-70)' }}>
                {refCode}
              </Text>
              <CopyToClipboard textToCopy={refCode}>
                <Text as="p" variant="p1semi" className={classNames.copyWrapper}>
                  Copy
                </Text>
              </CopyToClipboard>
            </div>
            <div className={classNames.socialMediaWrapper}>
              <Link
                href={getTwitterShareUrl({
                  url: '',
                  text: `Chill this summer, don't chase yields.

Join me over at the Summer Beach Club🏖️ and earn the best yields in DeFi with none of the effort.

Open a position using my code below and earn even more https://summer.fi/earn?referralCode=${refCode}`,
                })}
                target="_blank"
                className={classNames.socialMediaLink}
                onClick={() => {
                  handleButtonClick(`portfolio-beach-club-refer-and-earn-how-it-works-twitter`)
                }}
              >
                <Icon iconName="social_x_beach_club" size={45} />
              </Link>
              <CopyToClipboard
                textToCopy={`${window.location.origin}/earn?referralCode=${refCode}`}
              >
                <div className={classNames.socialMediaLink}>
                  <Icon iconName="social_link_beach_club" size={45} />
                </div>
              </CopyToClipboard>
            </div>
            <Text
              as="p"
              variant="p3"
              style={{
                color: 'var(--earn-protocol-secondary-40)',
                textAlign: 'center',
                maxWidth: '610px',
                display: 'inline-block',
                width: '100%',
              }}
            >
              If you want to generate a custom code, please contact us on{' '}
              <Link
                href={EXTERNAL_LINKS.DISCORD}
                style={{ display: 'inline', color: 'var(--beach-club-link)' }}
                target="_blank"
                onClick={() => {
                  handleButtonClick(`portfolio-beach-club-refer-and-earn-how-it-works-discord`)
                }}
              >
                <WithArrow
                  as="span"
                  variant="p3semi"
                  style={{
                    color: 'var(--beach-club-link)',
                    display: 'inline',
                  }}
                  wrapperStyle={{
                    display: 'inline',
                  }}
                >
                  discord
                </WithArrow>
              </Link>
            </Text>
          </div>
        </div>
      ) : (
        <Button
          variant="beachClubLarge"
          style={{
            maxWidth: '148px',
            minWidth: 'unset',
          }}
          disabled={isLoading || !isOwner}
          onClick={handleGenerateReferralCode}
        >
          Generate <Icon iconName="stars" size={20} />
        </Button>
      )}
    </div>
  )
}
