import { FaqSection } from '@summerfi/app-earn-ui'

import { sumrFaqData } from './sumr-faq-data'

import classNames from './SumrFaq.module.css'

export const SumrFaq = () => {
  return (
    <div className={classNames.sumrFaqWrapper}>
      <FaqSection
        data={sumrFaqData}
        wrapperClassName={classNames.faqSectionCustomWrapper}
        headerClassName={classNames.faqSectionHeaderWrapper}
        faqSectionClassName={classNames.faqSectionBlockWrapper}
      />
    </div>
  )
}
