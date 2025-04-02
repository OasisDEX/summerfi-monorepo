import { Card, FaqSection, vaultFaqData } from '@summerfi/app-earn-ui'

import classNames from './VaultDetailsFaq.module.scss'

export const VaultDetailsFaq = () => {
  return (
    <Card variant="cardSecondary">
      <FaqSection
        headerVariant="h5"
        faqSectionClassName={classNames.faqSectionBlockWrapper}
        data={vaultFaqData}
      />
    </Card>
  )
}
