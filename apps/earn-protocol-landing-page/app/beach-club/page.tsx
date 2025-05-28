'use client'
import { redirect } from 'next/navigation'

import { useLandingPageData } from '@/contexts/LandingPageContext'
import { BeachClubAutomatedExposure } from '@/features/beach-club/components/BeachClubAutomatedExposure/BeachClubAutomatedExposure'
import { BeachClubBoatPoints } from '@/features/beach-club/components/BeachClubBoatPoints/BeachClubBoatPoints'
import { BeachClubEarnBig } from '@/features/beach-club/components/BeachClubEarnBig/BeachClubEarnBig'
import { BeachClubGetRewarded } from '@/features/beach-club/components/BeachClubGetRewarded/BeachClubGetRewarded'
import { BeachClubHeading } from '@/features/beach-club/components/BeachClubHeading/BeachClubHeading'
import { BeachClubHowMuchCouldEarn } from '@/features/beach-club/components/BeachClubHowMuchCouldEarn/BeachClubHowMuchCouldEarn'
import { BeachClubHowToShare } from '@/features/beach-club/components/BeachClubHowToShare/BeachClubHowToShare'

import beachClubPageStyles from './beach-club-page.module.css'

export default function BeachClubPage() {
  const { landingPageData } = useLandingPageData()

  const beachClubEnabled = landingPageData?.systemConfig.features.BeachClub

  if (beachClubEnabled === false) {
    redirect('/')
  }

  return (
    <div className={beachClubPageStyles.beachClubPage}>
      <BeachClubHeading />
      <BeachClubGetRewarded />
      <BeachClubAutomatedExposure />
      <BeachClubEarnBig />
      <BeachClubHowMuchCouldEarn />
      <BeachClubBoatPoints />
      <BeachClubHowToShare />
    </div>
  )
}
