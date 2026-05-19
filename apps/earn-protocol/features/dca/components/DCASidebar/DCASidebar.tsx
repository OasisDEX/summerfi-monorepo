'use client'

import { useState } from 'react'
import { Card, Expander, Icon, Text } from '@summerfi/app-earn-ui'

import classNames from '@/features/dca/components/dca.module.css'

export const DCASidebar = () => {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <Card variant="cardSecondary" className={classNames.faqCard}>
      <Expander
        expanded={expanded === 'what-is-dca'}
        onExpand={() => setExpanded(expanded === 'what-is-dca' ? null : 'what-is-dca')}
        title={
          <div>
            <Icon iconName="cog" size={16} />
            <Text variant="p2semi">What is DCA?</Text>
          </div>
        }
      >
        <Text variant="p4">Idk...</Text>
      </Expander>
      <Expander
        expanded={expanded === 'how-dca-works'}
        onExpand={() => setExpanded(expanded === 'how-dca-works' ? null : 'how-dca-works')}
        title={
          <div>
            <Icon iconName="cog" size={16} />
            <Text variant="p2semi">How DCA works on Summer.fi?</Text>
          </div>
        }
      >
        <Text variant="p4">Idk...</Text>
      </Expander>
      <Expander
        expanded={expanded === 'dca-faqs'}
        onExpand={() => setExpanded(expanded === 'dca-faqs' ? null : 'dca-faqs')}
        title={
          <div>
            <Icon iconName="cog" size={16} />
            <Text variant="p2semi">DCA FAQ’s?</Text>
          </div>
        }
      >
        <Text variant="p4">Idk...</Text>
      </Expander>
    </Card>
  )
}
