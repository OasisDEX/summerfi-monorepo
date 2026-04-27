'use client'

import { InstitutionsContactForm } from '@/components/layout/LandingPageContent/components/InstitutionsContactForm'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { useFeatureFlagRedirect } from '@/hooks/use-feature-flag'

import institutionsPageStyles from './institutionsPage.module.css'

export default function InstitutionsPage() {
  const { landingPageData } = useLandingPageData()

  useFeatureFlagRedirect({
    config: landingPageData?.systemConfig,
    featureName: 'Institutions',
  })

  return (
    <div className={institutionsPageStyles.wrapper}>
      <InstitutionsContactForm />
    </div>
  )
}
