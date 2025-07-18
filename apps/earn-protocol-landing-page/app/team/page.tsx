'use client'
import { createRef, useEffect, useMemo, useState } from 'react'
import { Button, Emphasis, Icon, Text } from '@summerfi/app-earn-ui'
import {
  type IconNamesList,
  supportedDefillamaProtocols,
  supportedDefillamaProtocolsConfig,
} from '@summerfi/app-types'
import Image from 'next/image'
import Link from 'next/link'

import { teamList } from '@/app/team/constants'
import { type TeamListItem } from '@/app/team/types'
import { HistoryScroller } from '@/components/layout/LandingPageContent/components/HistoryScroller'
import { ProtocolScrollerItem } from '@/components/layout/LandingPageContent/components/ProtocolScroller'
import { BuildBySummerFi } from '@/components/layout/LandingPageContent/content/BuildBySummerFi'
import { StartEarningNow } from '@/components/layout/LandingPageContent/content/StartEarningNow'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { useFeatureFlagRedirect } from '@/hooks/use-feature-flag'
import sumrTokenBubbles from '@/public/img/landing-page/sumr-token_bubbles.svg'

import teamPageStyles from './teamPage.module.css'

type ProtocolItemType = {
  protocol: string
  protocolIcon: IconNamesList
  tvl: bigint
  url: string
}

function VerticalProtocolScroller({ protocols }: { protocols: ProtocolItemType[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (protocols.length <= 4) {
      return
    }
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % protocols.length)
        setIsAnimating(false)
      }, 800) // Corresponds to animation duration
    }, 3000)

    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(interval)
    }
  }, [protocols.length])

  const visibleProtocols = useMemo(() => {
    if (protocols.length === 0) {
      return []
    }
    const extendedProtocols = [...protocols, ...protocols, ...protocols, ...protocols]

    return extendedProtocols.slice(currentIndex, currentIndex + 5) // Get 5 to show the next one coming in
  }, [currentIndex, protocols])

  if (protocols.length === 0) {
    return null
  }

  const trackStyle = {
    transform: isAnimating ? 'translateY(-98px)' : 'translateY(0)', // 64px item + 16px gap
    transition: isAnimating ? 'transform 0.8s cubic-bezier(.21,.6,.5,.99)' : 'none',
  }

  return (
    <div className={teamPageStyles.protocolsVerticalScroller}>
      <div className={teamPageStyles.scrollerTrack} style={trackStyle}>
        {visibleProtocols.map((protocol, index) => (
          <div key={`${protocol.protocol}-${currentIndex + index}`}>
            <ProtocolScrollerItem
              {...protocol}
              protocolIcon={<Icon iconName={protocol.protocolIcon} />}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamMember({ member }: { member: TeamListItem }) {
  return (
    <div className={teamPageStyles.teamMember}>
      <Image src={member.image} alt={member.name} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text variant="h5" as="h5">
          {member.name}
        </Text>
        <Text variant="p2" as="p">
          {member.role}
        </Text>
        <Text variant="p2" as="p" className={teamPageStyles.teamMemberDescription}>
          {member.description}
        </Text>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {member.socialLinks?.linkedin && (
          <Link href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
            <Icon iconName="team_linkedin" size={32} />
          </Link>
        )}
        {member.socialLinks?.twitter && (
          <Link href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
            <Icon iconName="team_x" size={32} />
          </Link>
        )}
      </div>
    </div>
  )
}

export default function TeamPage() {
  const { landingPageData } = useLandingPageData()
  const videoRef = useMemo(() => createRef<HTMLVideoElement>(), [])
  const [isWatchingVideo, setIsWatchingVideo] = useState(false)
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(false)

  useFeatureFlagRedirect({
    config: landingPageData?.systemConfig,
    featureName: 'Team',
  })

  const protocolsList = useMemo(() => {
    if (!landingPageData?.protocolTvls) {
      return []
    }

    return supportedDefillamaProtocols.map((protocol) => {
      const protocolConfig = supportedDefillamaProtocolsConfig[protocol]

      return {
        protocol: protocolConfig.displayName,
        protocolIcon: supportedDefillamaProtocolsConfig[protocol].icon,
        tvl: BigInt(landingPageData.protocolTvls[protocol]),
        url: '',
      }
    })
  }, [landingPageData?.protocolTvls])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0 // Mute the video by default
    }
  }, [videoRef])

  const setFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen()
      setIsVideoFullScreen(true)
      videoRef.current.onfullscreenchange = () => {
        if (document.fullscreenElement === null) {
          setIsVideoFullScreen(false)
        }
      }
    }
  }

  const playVideo = () => {
    if (videoRef.current) {
      setIsWatchingVideo(true)
      videoRef.current.play()
      videoRef.current.volume = 1 // Set volume to 100% when playing the video
      videoRef.current.onended = () => {
        setIsWatchingVideo(false)
        if (videoRef.current) {
          videoRef.current.currentTime = 0 // Reset video to the start
        }
      }
    }
  }

  const stopVideo = () => {
    if (videoRef.current) {
      setIsWatchingVideo(false)
      videoRef.current.currentTime = 0 // Reset video to the start
      videoRef.current.pause()
    }
  }

  return (
    <div className={teamPageStyles.wrapper}>
      <div className={teamPageStyles.pageHeader}>
        <Text as="h1" variant="h1">
          Making the best of DeFi
          <br />
          <Emphasis variant="h1colorful">simple and safe </Emphasis>
        </Text>
        <div className={teamPageStyles.pageHeaderDetails}>
          <Text as="p" variant="p1">
            Summer.fi is the best place to borrow and earn in DeFi
          </Text>
        </div>
      </div>
      <div className={teamPageStyles.whoAreWe}>
        <div className={teamPageStyles.whoAreWeDescription}>
          <Text as="h2" variant="h2">
            Who are we?
          </Text>
          <Text as="p" variant="p1">
            Summer.fi is a decentralized finance (DeFi) app that enables uses to borrow, lend and
            multiply their crypto assets including ETH, WBTC, DAI, and USDC. Our aim is to focus on
            best in class security and reduced complexity to interact with crypto&apos;s highest
            quality assets, protocols and networks.
          </Text>
          <div className={teamPageStyles.whoAreWeButtons}>
            <Button variant="primaryLarge" onClick={isWatchingVideo ? stopVideo : playVideo}>
              {isWatchingVideo ? (
                <>
                  <Icon iconName="close" size={10} />
                  Stop the video
                </>
              ) : (
                <>
                  <Icon iconName="play" size={20} />
                  Watch the video
                </>
              )}
            </Button>
          </div>
        </div>
        <div className={teamPageStyles.whoAreWeImageVideo}>
          <video
            ref={videoRef}
            width="100%"
            playsInline
            preload="auto"
            onClick={isVideoFullScreen ? stopVideo : setFullscreen}
            style={{
              opacity: isWatchingVideo ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              borderRadius: '24px',
            }}
          >
            <source src="/img/landing-page/who-are-we-video.mp4" type="video/mp4" />
          </video>
          <Image
            src={sumrTokenBubbles}
            alt="$SUMR Token Bubbles"
            style={{
              opacity: isWatchingVideo ? 0 : 1,
              pointerEvents: isWatchingVideo ? 'none' : 'auto',
              transition: 'opacity 0.8s ease-in-out',
            }}
          />
        </div>
      </div>
      <div className={teamPageStyles.teamMembers}>
        <Text as="h2" variant="h2">
          Leadership that’s helped shape
          <br />
          DeFi from day 1
        </Text>
        <div className={teamPageStyles.teamMembersList}>
          {teamList.map((member) => (
            <TeamMember key={member.name} member={member} />
          ))}
        </div>
      </div>
      <div>
        <Text as="h2" variant="h2" style={{ textAlign: 'center', marginBottom: '-64px' }}>
          DeFi’s original frontend
        </Text>
        <HistoryScroller
          itemsList={[
            {
              date: '2016',
              title: 'Launched OasisDEX',
              description:
                'Launched as OasisDEX, one of the first projects by MakerDAO, serving as a front-end platform for the Maker Protocol.',
            },
            {
              date: '2018',
              title: 'Transitioned to Oasis.app',
              description:
                'Transitioned to Oasis.app, offering a more user-friendly interface and additional features, including borrowing and lending services, to cater to a broader audience.',
            },
            {
              date: '2021',
              title: 'Independence from MakerDAO',
              description:
                'Following the full decentralization of MakerDAO, Oasis.app became a standalone entity, operating independently while continuing to integrate with the Maker Protocol',
            },
            {
              date: '2023',
              title: 'Rebrand to Summer.fi',
              description:
                "Oasis.app rebrands to Summer.fi, shedding its “MakerDAO only” image and rolling out one transaction feature and stop loss automation support for Aave, Morpho, Compound, and other protocols. Solidifying it's best in class access to all DeFi protocol positioning.",
            },
            {
              date: '2025',
              title: 'Lazy Summer protocol launch',
              description:
                'Summer.fi debuts Lazy Summer Protocol, its debut yield protocol. Vaults automatically rebalance across protocols to give users top risk adjusted returns, while a permissionless SDK/API lets wallets, neobanks, and treasuries embed the strategies too. $SUMR was also introduced, the token that powers Lazy Summer Protocol.',
            },
          ]}
        />
      </div>
      <div className={teamPageStyles.ecosystemCutAbove}>
        <div className={teamPageStyles.ecosystemCutAboveDescription}>
          <Text as="h2" variant="h2">
            An ecosystem a cut above
            <br />
            the rest of DeFi
          </Text>
          <Text as="p" variant="p1">
            Lazy Summer gives effortless access to crypto&apos;s best DeFi yields. Instead of adding
            one more protocol to pick from, it removes complexity by funneling your deposit into the
            highest quality yield sources across the entire DeFi ecosystem so you get the best of
            everything without the endless choice.
          </Text>
        </div>
        <VerticalProtocolScroller protocols={protocolsList} />
      </div>
      <BuildBySummerFi proAppStats={landingPageData?.proAppStats} noHeaderDescription />
      <StartEarningNow />
    </div>
  )
}
