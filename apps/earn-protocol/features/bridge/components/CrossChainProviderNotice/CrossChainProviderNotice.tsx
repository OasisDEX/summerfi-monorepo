import { type FC } from 'react'
import { Icon, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import styles from './CrossChainProviderNotice.module.css'

export const CrossChainProviderNotice: FC = () => {
  return (
    <Link href="https://layerzero.network/" target="_blank" rel="noopener noreferrer">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logoSection}>
            <Icon iconName="layerzero" size={32} className={styles.logo} />
          </div>
          <div className={styles.textSection}>
            <Text variant="p2semiColorful" as="p" className={styles.title}>
              Powered by LayerZero
            </Text>
            <Text variant="p3semi" as="p" className={styles.subtitle}>
              Censorship-resistant. Immutable. Permissionless.
            </Text>
          </div>
          <div className={styles.arrowSection}>
            <svg
              className={styles.arrow}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9.29 6.71a.996.996 0 000 1.41L13.17 12l-3.88 3.88a.996.996 0 101.41 1.41l4.59-4.59a.996.996 0 000-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z" />
            </svg>
          </div>
        </div>
      </div>{' '}
    </Link>
  )
}
