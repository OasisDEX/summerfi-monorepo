import { FaqSection, vaultFaqData } from '@summerfi/app-earn-ui'
import { slugify } from '@summerfi/app-utils'
import { usePathname } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

import classNames from './LandingFaqSection.module.css'

export const LandingFaqSection = () => {
  const pathname = usePathname()

  const handleLandingFaqSection = (props: { expanded: boolean; title: string }) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-faq-section-${slugify(props.title)}-${props.expanded ? 'expand' : 'collapse'}`,
      page: pathname,
    })
  }

  return (
    <FaqSection
      headerClassName={classNames.faqSectionHeaderWrapper}
      faqSectionClassName={classNames.faqSectionBlockWrapper}
      data={vaultFaqData}
      onExpand={handleLandingFaqSection}
    />
  )
}
