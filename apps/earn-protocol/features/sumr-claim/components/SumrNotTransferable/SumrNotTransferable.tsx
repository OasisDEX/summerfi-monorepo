import { Card, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import classNames from './SumrNotTransferable.module.scss'

const boxes = [
  {
    preTitle: 'Reason 1',
    title: 'Rational reason 1',
    description:
      'With Summer, effortlessly earn the best yields and grow your capital faster. We automatically rebalance your assets to top protocols, maximizing your returns.',
    link: {
      label: 'Get $SUMR',
      href: '/',
    },
  },
  {
    preTitle: 'Reason 2',
    title: 'Rational reason 2',
    description:
      'With Summer, effortlessly earn the best yields and grow your capital faster. We automatically rebalance your assets to top protocols, maximizing your returns.',
    link: {
      label: 'Get $SUMR',
      href: '/',
    },
  },
  {
    preTitle: 'Reason 3',
    title: 'Rational reason 3',
    description:
      'With Summer, effortlessly earn the best yields and grow your capital faster. We automatically rebalance your assets to top protocols, maximizing your returns.',
    link: {
      label: 'Get $SUMR',
      href: '/',
    },
  },
]

export const SumrNotTransferable = () => {
  return (
    <div className={classNames.sumrNotTransferableWrapper}>
      <div className={classNames.header}>
        <Text as="h2" variant="h2">
          Non-Transferable, A feature not a bug
        </Text>
        <Text as="p" variant="p1">
          For the first 6 months, $SUMR will not be able to be bought or sold, it can only be
          earned. We believe that this is highly beneficial for our community and creates the most
          long term value.
        </Text>
      </div>
      <div className={classNames.boxes}>
        {boxes.map((box, index) => (
          <Card variant="cardPrimary" key={index} className={classNames.box}>
            <Text as="p" variant="p3semiColorful">
              {box.preTitle}
            </Text>
            <Text as="p" variant="p1semi">
              {box.title}
            </Text>
            <Text as="p" variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              {box.description}
            </Text>
            <Link href={box.link.href}>
              <WithArrow>{box.link.label}</WithArrow>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
