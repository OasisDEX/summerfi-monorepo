import { FaqSection } from '@summerfi/app-earn-ui'

import classNames from './SumrFaq.module.scss'

const faqData = [
  {
    title: 'What is the $SUMR token airdrop?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'Who qualifies for the $SUMR token airdrop? ',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'When will the $SUMR tokens start trading?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'Will the $RAYS points campaign continue?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
]

export const SumrFaq = () => {
  return (
    <div className={classNames.sumrFaqWrapper}>
      <FaqSection
        data={faqData}
        wrapperClassName={classNames.faqSectionCustomWrapper}
        headerClassName={classNames.faqSectionHeaderWrapper}
        faqSectionClassName={classNames.faqSectionBlockWrapper}
      />
    </div>
  )
}
