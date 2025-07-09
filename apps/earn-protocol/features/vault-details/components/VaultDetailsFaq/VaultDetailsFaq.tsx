import { Card, FaqSection, vaultFaqData } from '@summerfi/app-earn-ui'

import classNames from './VaultDetailsFaq.module.css'

interface VaultDetailsFaqProps {
  id?: string
}

export const VaultDetailsFaq = ({ id }: VaultDetailsFaqProps) => {
  return (
    <Card variant="cardSecondary" id={id}>
      <FaqSection
        headerVariant="h5"
        faqSectionClassName={classNames.faqSectionBlockWrapper}
        data={vaultFaqData}
      />
    </Card>
  )
}
