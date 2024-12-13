import { FaqSection } from '@summerfi/app-earn-ui'

import classNames from './LandingFaqSection.module.scss'

export const LandingFaqSection = () => {
  return (
    <FaqSection
      headerClassName={classNames.faqSectionHeaderWrapper}
      faqSectionClassName={classNames.faqSectionBlockWrapper}
      data={[
        {
          title: 'Why should I trust your platform?',
          content: 'Good question ✨',
        },
        {
          title: 'How does the strategy work?',
          content: 'Good question ✨',
        },
        {
          title: 'Where does the yield come from?',
          content: 'Good question ✨',
        },
        {
          title: 'What’s the platform of Summer.fi?',
          content: 'Good question ✨',
        },
      ]}
    />
  )
}
