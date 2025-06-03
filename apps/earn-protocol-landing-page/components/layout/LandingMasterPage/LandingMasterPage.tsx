'use client'

import { type PropsWithChildren, useEffect, useMemo, useState } from 'react'
import {
  BeachClubRadialGradient,
  Footer,
  GlobalIssueBanner,
  NewsletterWrapper,
  Text,
} from '@summerfi/app-earn-ui'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import { useLandingPageData } from '@/contexts/LandingPageContext'

import landingMasterPageStyles from '@/components/layout/LandingMasterPage/landingMasterPage.module.css'

import palmLeft from '@/public/img/beach-club/palm_1.png'
import palmRight from '@/public/img/beach-club/palm_2.png'

interface LandingMasterPageProps {}

export const LandingMasterPage: React.FC<PropsWithChildren<LandingMasterPageProps>> = ({
  children,
}) => {
  const [scrolledAmount, setScrolledAmount] = useState(0)
  const { landingPageData } = useLandingPageData()
  const pathname = usePathname()

  const isBeachClub = pathname.includes('beach-club')
  const isInstitutions = pathname.includes('institutions')

  const showBubbles = !isBeachClub
  const showPalms = isBeachClub

  useEffect(() => {
    const handleScroll = () => {
      setScrolledAmount(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollAction = useMemo(() => {
    if (isInstitutions) {
      return {
        offset: Number(scrolledAmount * 0.2) - 100,
        opacity: 1 - Number(scrolledAmount * 0.0015),
      }
    }

    return { offset: scrolledAmount * 0.2, opacity: 1 - Number(scrolledAmount * 0.0015) }
  }, [scrolledAmount, isInstitutions])

  return (
    <div className={landingMasterPageStyles.mainContainer}>
      {landingPageData?.systemConfig.bannerMessage && (
        <GlobalIssueBanner message={landingPageData.systemConfig.bannerMessage} />
      )}

      {showBubbles && (
        <div
          className={landingMasterPageStyles.bubbles}
          style={{ top: `${scrollAction.offset}px`, opacity: scrollAction.opacity }}
        >
          <div className={landingMasterPageStyles.bubblesShadow} />
          <video
            width="100%"
            autoPlay
            loop
            muted
            playsInline
            className={landingMasterPageStyles.video}
          >
            <source src="/img/landing-page/bubbles.mp4" type="video/mp4" />
          </video>
        </div>
      )}
      <div className={landingMasterPageStyles.appContainer}>
        <NavigationWrapper />
        {showPalms && (
          <div className={landingMasterPageStyles.palms}>
            <Image
              src={palmLeft}
              alt="palm_left"
              height="577"
              style={{
                position: 'absolute',
                left: '-100px',
                transition: 'opacity 0.3s ease-in-out',
                zIndex: -1,
              }}
              className={landingMasterPageStyles.palmHidden}
              priority
            />
            <BeachClubRadialGradient isBeachClub opacity={0.7} />
            <Image
              src={palmRight}
              alt="palm_right"
              height="422"
              style={{
                position: 'absolute',
                right: '0',
                top: '130px',
                transition: 'opacity 0.3s ease-in-out',
                zIndex: -1,
              }}
              priority
            />
          </div>
        )}
        {children}
        <Footer
          logo="/img/branding/logo-light.svg"
          newsletter={
            <div>
              <Text
                as="h3"
                variant="p1semi"
                style={{
                  marginBottom: 'var(--general-space-8)',
                }}
              >
                Stay up to date
              </Text>
              <Text
                as="p"
                variant="p2"
                style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-space-medium)',
                }}
              >
                Subscribe to the newsletter for Summer.fi updates
              </Text>
              <div
                style={{
                  maxWidth: '380px',
                }}
              >
                <NewsletterWrapper inputBtnLabel="Subscribe" />
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
