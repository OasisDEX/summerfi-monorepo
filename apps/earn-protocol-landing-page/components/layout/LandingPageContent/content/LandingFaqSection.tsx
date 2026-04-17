import {
  FaqSection,
  lpCoreFaqData,
  lpIntegrationsFaqData,
  lpPermissionlessDefiVaultsFaqData,
  lpRwaFaqData,
  lpSelfManagedVaultFaqData,
} from '@summerfi/app-earn-ui'
import { slugify } from '@summerfi/app-utils'
import { usePathname } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

import classNames from './LandingFaqSection.module.css'

export const LandingCoreFaqSection = () => {
  const pathname = usePathname()

  const handleLandingCoreFaqSection = (props: { expanded: boolean; title: string }) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-core-faq-section-${slugify(props.title)}-${props.expanded ? 'expand' : 'collapse'}`,
      page: pathname,
    })
  }

  return (
    <FaqSection
      headerClassName={classNames.faqSectionHeaderWrapper}
      faqSectionClassName={classNames.faqSectionBlockWrapper}
      data={lpCoreFaqData}
      onExpand={handleLandingCoreFaqSection}
    />
  )
}

export const LandingRwaFaqSection = () => {
  const pathname = usePathname()

  const handleLandingRwaFaqSection = (props: { expanded: boolean; title: string }) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-rwa-faq-section-${slugify(props.title)}-${props.expanded ? 'expand' : 'collapse'}`,
      page: pathname,
    })
  }

  return (
    <FaqSection
      headerClassName={classNames.faqSectionHeaderWrapper}
      faqSectionClassName={classNames.faqSectionBlockWrapper}
      data={lpRwaFaqData}
      onExpand={handleLandingRwaFaqSection}
    />
  )
}

export const LandingIntegrationsFaqSection = () => {
  const pathname = usePathname()

  const handleLandingIntegrationsFaqSection = (props: { expanded: boolean; title: string }) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-integrations-faq-section-${slugify(props.title)}-${props.expanded ? 'expand' : 'collapse'}`,
      page: pathname,
    })
  }

  return (
    <FaqSection
      headerClassName={classNames.faqSectionHeaderWrapper}
      faqSectionClassName={classNames.faqSectionBlockWrapper}
      data={lpIntegrationsFaqData}
      onExpand={handleLandingIntegrationsFaqSection}
    />
  )
}

export const LandingPermissionlessDefiVaultsFaqSection = () => {
  const pathname = usePathname()

  const handleLandingPermissionlessDefiVaultsFaqSection = (props: {
    expanded: boolean
    title: string
  }) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-permissionless-defi-vaults-faq-section-${slugify(props.title)}-${props.expanded ? 'expand' : 'collapse'}`,
      page: pathname,
    })
  }

  return (
    <FaqSection
      headerClassName={classNames.faqSectionHeaderWrapper}
      faqSectionClassName={classNames.faqSectionBlockWrapper}
      data={lpPermissionlessDefiVaultsFaqData}
      onExpand={handleLandingPermissionlessDefiVaultsFaqSection}
    />
  )
}

export const LandingSelfManagedVaultFaqSection = () => {
  const pathname = usePathname()

  const handleLandingSelfManagedVaultFaqSection = (props: { expanded: boolean; title: string }) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-self-managed-vault-faq-section-${slugify(props.title)}-${props.expanded ? 'expand' : 'collapse'}`,
      page: pathname,
    })
  }

  return (
    <FaqSection
      headerClassName={classNames.faqSectionHeaderWrapper}
      faqSectionClassName={classNames.faqSectionBlockWrapper}
      data={lpSelfManagedVaultFaqData}
      onExpand={handleLandingSelfManagedVaultFaqSection}
    />
  )
}
