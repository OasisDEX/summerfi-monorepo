'use client'
import { Text } from '@summerfi/app-earn-ui'
import { redirect } from 'next/navigation'

import { useLandingPageData } from '@/contexts/LandingPageContext'

import publicAccessVaultsStyles from './publicAccessVaults.module.css'

export default function PublicAccessVaults() {
  const { landingPageData } = useLandingPageData()

  const institutionsEnabled = landingPageData?.systemConfig.features.Institutions

  if (institutionsEnabled === false) {
    redirect('/')
  }

  return (
    <div className={publicAccessVaultsStyles.wrapper}>
      <Text>
        Public access vaults provide institutions with a seamless way to engage with DeFi, offering
        a balance of accessibility and control.
      </Text>
    </div>
  )
}
