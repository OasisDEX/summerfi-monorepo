import { FaqSection, vaultFaqData } from '@summerfi/app-earn-ui'

import classNames from './LandingFaqSection.module.css'

export const LandingFaqSection = () => {
  return (
    <FaqSection
      headerClassName={classNames.faqSectionHeaderWrapper}
      faqSectionClassName={classNames.faqSectionBlockWrapper}
      data={vaultFaqData}
    />
  )
}
