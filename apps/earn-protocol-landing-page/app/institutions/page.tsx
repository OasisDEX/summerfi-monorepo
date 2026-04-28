'use client'

import { InstitutionsContactForm } from '@/components/layout/LandingPageContent/components/InstitutionsContactForm'

import institutionsPageStyles from './institutionsPage.module.css'

export default function InstitutionsPage() {
  return (
    <div className={institutionsPageStyles.wrapper}>
      <InstitutionsContactForm />
    </div>
  )
}
