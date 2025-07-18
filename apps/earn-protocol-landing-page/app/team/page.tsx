'use client'
import { Button, Emphasis, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'

import { teamList } from '@/app/team/constants'
import { type TeamListItem } from '@/app/team/types'
import { BuildBySummerFi } from '@/components/layout/LandingPageContent/content/BuildBySummerFi'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { useFeatureFlagRedirect } from '@/hooks/use-feature-flag'
import sumrTokenBubbles from '@/public/img/landing-page/sumr-token_bubbles.svg'

import teamPageStyles from './teamPage.module.css'

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

  useFeatureFlagRedirect({
    config: landingPageData?.systemConfig,
    featureName: 'Team',
  })

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
            <Button variant="primaryLarge">
              <Icon iconName="play" size={20} />
              Watch the video
            </Button>
            <Link href="">
              <WithArrow>How we&apos;ve got here</WithArrow>
            </Link>
          </div>
        </div>
        <Image src={sumrTokenBubbles} alt="$SUMR Token Bubbles" />
      </div>
      <div className={teamPageStyles.teamMembers}>
        <Text as="h1" variant="h1">
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
      <BuildBySummerFi proAppStats={landingPageData?.proAppStats} noHeaderDescription />
    </div>
  )
}
