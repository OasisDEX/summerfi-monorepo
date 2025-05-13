import { Fragment } from 'react'
import { Text } from '@summerfi/app-earn-ui'

import { TransakIconWrapper } from '@/features/transak/components/TransakIconWrapper/TransakIconWrapper'

import classNames from './TransakAboutKyc.module.css'

const aboutKYCCopies = [
  {
    title: 'Why need to do KYC?',
    description:
      'KYC is required by financial regulations to prevent fraud and ensure secure transactions.',
  },
  {
    title: 'Multiple KYC levels',
    description:
      'Each higher level requires more information to verify a user’s account and comes with the benefit of higher order limits.',
  },
  {
    title: 'What information you need to provide',
    description: 'Your full name, phone number, and current address.',
  },
]

export const TransakAboutKycStep = () => {
  return (
    <div className={classNames.transakAboutKycWrapper}>
      <TransakIconWrapper icon="kyc_colorful" size={45} />
      {aboutKYCCopies.map((item) => (
        <Fragment key={item.title}>
          <Text
            as="p"
            variant="p2"
            style={{
              color: 'var(--earn-protocol-secondary-100)',
              marginBottom: 'var(--general-space-4)',
            }}
          >
            {item.title}
          </Text>
          <Text
            as="p"
            variant="p2"
            style={{
              color: 'var(--earn-protocol-secondary-60)',
              marginBottom: 'var(--general-space-16)',
            }}
          >
            {item.description}
          </Text>
        </Fragment>
      ))}
    </div>
  )
}
