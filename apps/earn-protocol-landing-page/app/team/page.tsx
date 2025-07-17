'use client'
import { redirect } from 'next/navigation'

import { useLandingPageData } from '@/contexts/LandingPageContext'

export default function TeamPage() {
  const { landingPageData } = useLandingPageData()

  if (landingPageData && !landingPageData.systemConfig.features.Team) {
    redirect('/')
  }

  return <div>team page</div>
}
