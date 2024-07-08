'use client'
import { useCallback, useMemo } from 'react'
import { Button, Text } from '@summerfi/app-ui'
import { useConnectWallet } from '@web3-onboard/react'
import { usePathname, useRouter } from 'next/navigation'

import { ClaimRaysTitle } from '@/components/molecules/ClaimRaysTitle/ClaimRaysTitle'
import { CriteriaList } from '@/components/molecules/CriteriaList/CriteriaList'
import { CalculatorModal } from '@/components/organisms/CalculatorModal/CalculatorModal'
import { trackButtonClick } from '@/helpers/mixpanel'
import { useClientSideMount } from '@/helpers/use-client-side-mount'
import { RaysApiResponse } from '@/server-handlers/rays'

interface ClaimRaysPageProps {
  userAddress: string
  pointsEarnedPerYear?: number
  userRays:
    | {
        rays: RaysApiResponse
        error?: undefined
      }
    | {
        error: unknown
        rays?: undefined
      }
    | null
}

export default ({ userAddress, userRays, pointsEarnedPerYear }: ClaimRaysPageProps) => {
  const [{ wallet }, connect] = useConnectWallet()
  const { push } = useRouter()
  const currentPath = usePathname()
  const mountedOnClient = useClientSideMount()

  const dynamicWalletAddress = useMemo(() => wallet?.accounts[0].address, [wallet?.accounts])

  const goToWalletView = useCallback(
    (walletAddress: string) => {
      if (walletAddress) {
        push(`${currentPath}?userAddress=${walletAddress}`)
      }
    },
    [currentPath, push],
  )

  const mainCta = useCallback(() => {
    if (
      userRays?.rays?.userTypes.includes('SummerFi Power User') ??
      userRays?.rays?.userTypes.includes('SummerFi User')
    ) {
      trackButtonClick({
        id: 'ClaimRays',
        page: currentPath,
        userAddress,
      })
      push(`${currentPath}/claimed?userAddress=${dynamicWalletAddress}`)

      return
    }
    trackButtonClick({
      id: 'OpenPosition',
      page: currentPath,
      userAddress,
    })
    push(`${currentPath}/open-position?userAddress=${dynamicWalletAddress}`)
  }, [currentPath, dynamicWalletAddress, push, userAddress, userRays?.rays?.userTypes])

  const isViewingOwnWallet = useMemo(
    () => userAddress === dynamicWalletAddress,
    [userAddress, dynamicWalletAddress],
  )

  const claimButtonDisabled = useMemo(() => {
    if (!isViewingOwnWallet) return true

    return undefined
  }, [isViewingOwnWallet])

  return (
    <>
      <ClaimRaysTitle
        userAddress={userAddress}
        userRays={userRays}
        pointsEarnedPerYear={pointsEarnedPerYear}
      />
      <CriteriaList userRays={userRays} />

      {mountedOnClient && typeof userAddress !== 'undefined' && isViewingOwnWallet && (
        <Button
          disabled={claimButtonDisabled}
          variant="primaryLarge"
          style={{ marginTop: 'var(--space-l)', marginBottom: 'var(--space-s)' }}
          onClick={mainCta}
        >
          Claim $RAYS
        </Button>
      )}

      {mountedOnClient &&
        typeof userAddress !== 'undefined' &&
        !isViewingOwnWallet &&
        !dynamicWalletAddress && (
          <Button
            variant="primaryLarge"
            style={{ marginTop: 'var(--space-l)', marginBottom: 'var(--space-s)' }}
            onClick={() => {
              trackButtonClick({
                id: 'ConnectWallet',
                page: currentPath,
                userAddress,
              })
              void connect().then(([{ accounts }]) => {
                goToWalletView(accounts[0].address)
              })
            }}
          >
            Connect wallet
          </Button>
        )}

      {mountedOnClient &&
        typeof userAddress !== 'undefined' &&
        !isViewingOwnWallet &&
        dynamicWalletAddress && (
          <Button
            variant="secondaryLarge"
            style={{ marginTop: 'var(--space-l)', marginBottom: 'var(--space-s)' }}
            onClick={() => {
              trackButtonClick({
                id: 'ViewYourPoints',
                page: currentPath,
                userAddress,
              })
              goToWalletView(dynamicWalletAddress)
            }}
          >
            View your points
          </Button>
        )}
      {mountedOnClient && typeof userAddress === 'undefined' && (
        <Button
          variant="primaryLarge"
          style={{ marginTop: 'var(--space-l)', marginBottom: 'var(--space-s)' }}
          onClick={() => {
            trackButtonClick({
              id: 'ConnectWallet',
              page: currentPath,
            })
            connect()
          }}
        >
          Connect wallet
        </Button>
      )}
      <CalculatorModal />
      <Text
        as="p"
        variant="p1"
        style={{ color: 'var(--color-neutral-80)', marginTop: 'var(--space-l)' }}
      >
        Over 2 million DeFi users are eligible for Summer.fi Rays.
      </Text>
    </>
  )
}
