import { Card, TabBar, Text } from '@summerfi/app-earn-ui'

import { CryptoUtilitiesBasics } from '@/features/crypto-utilities/components/CryptoUtilitiesBasics/CryptoUtilitiesBasics'

import classNames from './CryptoUtilities.module.scss'

const tabs = [
  { label: 'Basics', content: <CryptoUtilitiesBasics /> },
  { label: 'Automations', content: <div>Automations</div> },
  { label: 'Advanced', content: <div>Advanced</div> },
]

export const CryptoUtilities = () => {
  return (
    <Card className={classNames.wrapper}>
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