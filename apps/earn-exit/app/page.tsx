'use client'

import { useEffect, useState } from 'react'
import { Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

import { ConnectButton } from '@/components/ConnectButton'
import { FractalGlassBackground } from '@/components/FractalGlassBackground/FractalGlassBackground'

import styles from './page.module.css'

export default function LandingPage() {
  const router = useRouter()
  // status === 'connected' only — during wagmi's 'reconnecting' restore, isConnected is
  // already true from a stale stored address, which would bounce users with a locked wallet.
  const { address, status: accountStatus } = useAccount()

  // Hydration guard: the prerendered HTML never knows the wallet state.
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // A connected wallet has nothing to do here — send it straight to its portfolio.
  useEffect(() => {
    if (mounted && accountStatus === 'connected') {
      router.replace(`/portfolio?wallet=${address}`)
    }
  }, [mounted, accountStatus, address, router])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <FractalGlassBackground skewed />
        </div>
        <div className={styles.heroVignette} />
        <div className={styles.heroContent}>
          <div className={styles.heroLogo}>
            <Image src="/img/branding/dot-dark.svg" alt="Summer.fi" width={64} height={64} />
          </div>
          <Text as="h3" variant="h3">
            Summer.fi is winding down.
          </Text>
          <Text
            as="p"
            variant="p1"
            style={{
              textShadow: '1px 1px 0 rgba(0,0,0,0.2)',
            }}
          >
            Read more on the{' '}
            <Link href="#" className={styles.blogLink}>
              blog post
            </Link>
            .
          </Text>
          <div className={styles.heroCta}>
            <ConnectButton />
            <Text as="p" variant="p4">
              to view and exit your positions
            </Text>
          </div>
        </div>
        <div className={styles.heroFooter}>
          <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
            Summer.fi 2026
          </Text>
        </div>
      </section>
    </div>
  )
}
