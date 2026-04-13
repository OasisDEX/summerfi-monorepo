import { Emphasis, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import badgeIcon from '@/public/img/landing-page/icons/badge-check.svg'
import galleryIcon from '@/public/img/landing-page/icons/gallery-vertical-end.svg'
import shieldIcon from '@/public/img/landing-page/icons/shield-half.svg'
import zapIcon from '@/public/img/landing-page/icons/zap.svg'

import styles from '@/components/layout/LandingPageContent/components/YieldProtocolOpenToAll.module.css'

const items = [
  {
    icon: zapIcon,
    title: 'Vault optimization via automation',
    description: 'Automated rebalancing is built into the core of the Lazy Summer Protocol.',
  },
  {
    icon: galleryIcon,
    title: 'Multi Protocol and network access',
    description: 'Access a DeFi yield ecosystem a cut above the rest including top protocols.',
  },
  {
    icon: shieldIcon,
    title: 'Risk controls built into the core',
    description: 'Flexible risk oversight dependent on vault strategies and products.',
  },
  {
    icon: badgeIcon,
    title: 'Instant liquidity, always',
    description: 'Lazy Summer vaults prioritize deep and instant liquidity always available.',
  },
]

export const YieldProtocolOpenToAll = () => {
  return (
    <>
      <Text
        variant="h5"
        style={{
          marginBottom: 'var(--spacing-space-large)',
          textAlign: 'center',
        }}
      >
        The Lazy Summer Protocol is the{' '}
        <Emphasis variant="h5colorful">yield protocol open to all</Emphasis>, where serious
        <br /> capital earns more by doing less.
      </Text>
      <div className={styles.container}>
        {items.map((item) => (
          <div key={item.title} className={styles.item}>
            <div className={styles.iconWrapper}>
              <Image
                alt={item.title}
                src={item.icon}
                width={25}
                height={25}
                className={styles.icon}
              />
            </div>
            <Text variant="p2semi" as="p" className={styles.title}>
              {item.title}
            </Text>
            <Text variant="p2" as="p" className={styles.description}>
              {item.description}
            </Text>
          </div>
        ))}
      </div>
    </>
  )
}
