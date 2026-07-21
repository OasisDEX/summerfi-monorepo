'use client'

import { Suspense, useEffect, useState } from 'react'
import { Button, Card, SkeletonLine, Text } from '@/components/ui'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { type Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'

import { ConnectButton } from '@/components/ConnectButton'
import { ExitModal } from '@/components/ExitModal'
import { FooterWrapper } from '@/components/FooterWrapper'
import { FractalGlassBackground } from '@/components/FractalGlassBackground/FractalGlassBackground'
import { PositionCard } from '@/components/PositionCard'
import { StakedSumrCard } from '@/components/StakedSumrCard'
import { UnstakeModal } from '@/components/UnstakeModal'
import { CHAIN_LABELS } from '@/constants/chains'
import { usePositions } from '@/hooks/usePositions'
import { useStakedSumr } from '@/hooks/useStakedSumr'
import { type UnstakeRequest } from '@/hooks/useUnstakeFlow'
import { type FleetPosition } from '@/lib/positions'
import { estimateUsdValue } from '@/lib/prices'
import { type SumrStake } from '@/lib/staking'

import styles from '@/app/page.module.css'

const PortfolioContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const walletParam = searchParams.get('wallet')
  const { address, status: accountStatus } = useAccount()
  const [exitPosition, setExitPosition] = useState<FleetPosition | null>(null)
  const [unstakeRequest, setUnstakeRequest] = useState<UnstakeRequest | null>(null)

  // Hydration guard: this is a static export, so the server prerenders with no wallet and no
  // `?wallet=` param (viewedAddress undefined). The client resolves both immediately, which would
  // produce a different tree. Gate all wallet/param-dependent content on `mounted` so the server
  // HTML and the first client render are identical.
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // ?wallet= wins so any address can be inspected (deliberately public); the connected
  // wallet is the fallback. Exits stay gated to the connected wallet's own positions.
  const paramAddress = walletParam && isAddress(walletParam) ? (walletParam as Address) : undefined
  const viewedAddress = paramAddress ?? address
  const isOwnWallet = Boolean(
    address && viewedAddress && address.toLowerCase() === viewedAddress.toLowerCase(),
  )

  // Keep the URL shareable: stamp the connected address into ?wallet= when it's missing.
  // status === 'connected' only — a stale 'reconnecting' address must not be stamped.
  useEffect(() => {
    if (accountStatus === 'connected' && !walletParam) {
      router.replace(`/portfolio?wallet=${address}`)
    }
  }, [accountStatus, address, walletParam, router])

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching: positionsRefetching,
  } = usePositions(viewedAddress)
  const {
    data: staked,
    refetch: refetchStaked,
    isRefetching: stakedRefetching,
  } = useStakedSumr(viewedAddress)
  const stakedPosition = staked?.position ?? null

  // Seamless refresh: dim the current list while a refetch is in flight (no skeleton, which is
  // reserved for the initial load). pointer-events off so stale action buttons can't be clicked.
  const fadeWhileRefetching = (fading: boolean) =>
    ({
      opacity: fading ? 0.45 : 1,
      transition: 'opacity 0.2s ease-out',
      pointerEvents: fading ? 'none' : undefined,
    }) as const

  return (
    <>
      <div className={styles.portfolioBackground}>
        <FractalGlassBackground skewed />
      </div>
      <div className={styles.portfolioVignette} />
      <div className={styles.portfolioContent}>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: 1200,
            margin: '0 auto',
            padding: '24px 16px',
          }}
        >
          <Link href="/" prefetch={false} style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/img/branding/logo-dark.svg" alt="Summer.fi" width={130} height={28} />
          </Link>
          <ConnectButton />
        </header>
        <div
          style={{
            width: '100%',
            maxWidth: 900,
            margin: '0 auto',
            padding: '40px 16px 128px',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--general-space-24)',
            flex: 1,
          }}
        >
          <Text as="h2" variant="h2">
            {mounted && viewedAddress && !isOwnWallet ? 'Positions' : 'Your positions'}
          </Text>

          {/* Until mounted, render a stable loading shell so SSG HTML matches the first client
              render (viewedAddress is only known on the client). */}
          {!mounted ? (
            <>
              <SkeletonLine height={96} width="100%" />
              <SkeletonLine height={96} width="100%" />
            </>
          ) : null}

          {mounted && !viewedAddress ? (
            <Card
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
            >
              <Text as="p" variant="p1semi">
                Connect the wallet you deposited with to see your positions.
              </Text>
              <ConnectButton />
            </Card>
          ) : null}

          {mounted && viewedAddress && !isOwnWallet ? (
            <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              Viewing {viewedAddress} — connect that wallet to exit its positions.
            </Text>
          ) : null}

          {mounted && viewedAddress && isLoading ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--general-space-8)',
              }}
            >
              <SkeletonLine height={96} width="100%" />
              <SkeletonLine height={96} width="100%" />
            </div>
          ) : null}

          {mounted && viewedAddress && error ? (
            <Card style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Text as="p" variant="p2">
                Could not read the blockchain. Check your connection (or the configured RPC
                endpoints) and try again.
              </Text>
              <Button variant="secondarySmall" onClick={() => refetch()}>
                Retry
              </Button>
            </Card>
          ) : null}

          {mounted && viewedAddress && data && data.positions.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--general-space-8)',
                ...fadeWhileRefetching(positionsRefetching),
              }}
            >
              {data.positions.map((position) => (
                <PositionCard
                  key={`${position.chainId}-${position.fleetAddress}`}
                  position={position}
                  usdValue={estimateUsdValue(position, data.prices)}
                  onExit={isOwnWallet ? setExitPosition : undefined}
                />
              ))}
            </div>
          ) : null}

          {mounted && viewedAddress && data && data.positions.length === 0 ? (
            <Card>
              <Text as="p" variant="p2">
                No active positions found for {viewedAddress}. If you expect one, the wallet may
                hold it on a chain whose RPC failed{' '}
                {data.failedChainIds.length > 0
                  ? `(failed: ${data.failedChainIds.map((id) => CHAIN_LABELS[id]).join(', ')})`
                  : ''}
                , or it was already withdrawn.
              </Text>
            </Card>
          ) : null}

          {mounted &&
          viewedAddress &&
          data &&
          data.failedChainIds.length > 0 &&
          data.positions.length > 0 ? (
            <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-warning-100)' }}>
              Could not check: {data.failedChainIds.map((id) => CHAIN_LABELS[id]).join(', ')} — RPC
              unavailable. Positions there are not shown.
            </Text>
          ) : null}

          {mounted && viewedAddress && stakedPosition ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--general-space-24)',
                marginTop: 'var(--general-space-16)',
                ...fadeWhileRefetching(stakedRefetching),
              }}
            >
              <Text as="h3" variant="h3">
                Staked SUMR
              </Text>
              <StakedSumrCard
                position={stakedPosition}
                onUnstake={
                  isOwnWallet
                    ? (stake: SumrStake) =>
                        setUnstakeRequest({ position: stakedPosition, stake, claimRewards: false })
                    : undefined
                }
                onClaim={
                  isOwnWallet
                    ? () =>
                        setUnstakeRequest({
                          position: stakedPosition,
                          stake: null,
                          claimRewards: true,
                        })
                    : undefined
                }
              />
            </div>
          ) : null}
        </div>
        <FooterWrapper />
      </div>
      <ExitModal
        position={exitPosition}
        onClose={() => setExitPosition(null)}
        onRefresh={() => void refetch()}
      />
      <UnstakeModal
        request={unstakeRequest}
        onClose={() => setUnstakeRequest(null)}
        onRefresh={() => void refetchStaked()}
      />
    </>
  )
}

// useSearchParams requires a Suspense boundary under static export.
export default function PortfolioPage() {
  return (
    <Suspense fallback={null}>
      <PortfolioContent />
    </Suspense>
  )
}
