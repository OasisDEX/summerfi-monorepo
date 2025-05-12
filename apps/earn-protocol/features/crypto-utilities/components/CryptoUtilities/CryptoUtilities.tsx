import { Card, TabBar, Text } from '@summerfi/app-earn-ui'

import { CryptoUtilitiesBasics } from '@/features/crypto-utilities/components/CryptoUtilitiesBasics/CryptoUtilitiesBasics'

import classNames from './CryptoUtilities.module.css'

const tabs = [
  {
    id: 'basics',
    label: 'Basics',
    content: <CryptoUtilitiesBasics />,
  },
  {
    id: 'automations',
    label: 'Automations',
    content: <div>Automations</div>,
  },
  {
    id: 'advanced',
    label: 'Advanced',
    content: <div>Advanced</div>,
  },
]

export const CryptoUtilities = () => {
  return (
    <Card className={classNames.wrapper} variant="cardSecondary">
      <Text as="h5" variant="h5" className={classNames.header}>
        Crypto Utilities
      </Text>
      <Text as="p" variant="p2" className={classNames.description}>
        Crypto utilities are the different ways you can actually use a cryptocurrency, beyond just
        holding or trading it.
      </Text>
      <TabBar tabs={tabs} />
    </Card>
  )
}
