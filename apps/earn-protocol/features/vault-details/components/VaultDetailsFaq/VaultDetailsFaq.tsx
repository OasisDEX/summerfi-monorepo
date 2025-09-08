'use client'
import { Card, FaqSection, vaultFaqData } from '@summerfi/app-earn-ui'
import { slugify } from '@summerfi/app-utils'

import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'

import classNames from './VaultDetailsFaq.module.css'

interface VaultDetailsFaqProps {
  id?: string
}

export const VaultDetailsFaq = ({ id }: VaultDetailsFaqProps) => {
  const handleButtonClick = useHandleButtonClickEvent()

  const handleExpanderToggle =
    (expanderId: string) => (props: { expanded: boolean; title: string }) => {
      handleButtonClick(
        `vault-details-expander-${expanderId}-${slugify(props.title)}-${props.expanded ? 'open' : 'close'}`,
      )
    }

  return (
    <Card variant="cardSecondary" id={id}>
      <FaqSection
        headerVariant="h5"
        faqSectionClassName={classNames.faqSectionBlockWrapper}
        data={vaultFaqData}
        onExpand={handleExpanderToggle('faq')}
      />
    </Card>
  )
}
