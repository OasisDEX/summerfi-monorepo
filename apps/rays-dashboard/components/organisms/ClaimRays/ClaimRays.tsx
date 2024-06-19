'use client'
import { useCallback, useEffect, useMemo } from 'react'
import { Button, Text } from '@summerfi/app-ui'
import { useConnectWallet } from '@web3-onboard/react'
import { usePathname, useRouter } from 'next/navigation'

import { ClaimRaysTitle } from '@/components/molecules/ClaimRaysTitle/ClaimRaysTitle'
import { CriteriaList } from '@/components/molecules/CriteriaList/CriteriaList'
import { RaysApiResponse } from '@/server-handlers/rays'

interface ClaimRaysPageProps {
  userAddress: string
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

export default ({ userAddress, userRays }: ClaimRaysPageProps) => {
  const [{ wallet }, connect] = useConnectWallet()
  const { replace, push } = useRouter()
  const currentPath = usePathname()

  const dynamicWalletAddress = useMemo(() => wallet?.accounts[0].address, [wallet?.accounts])

  const goToOwnWalletView = useCallback(() => {
    replace(`${currentPath}?userAddress=${dynamicWalletAddress}`)
  }, [currentPath, dynamicWalletAddress, replace])

  const goToClaimedView = useCallback(() => {
    push(`${currentPath}/claimed?userAddress=${dynamicWalletAddress}`)
  }, [currentPath, dynamicWalletAddress, push])

  useEffect(() => {
    // if user is connected and is visiting a page without wallet
    // address (its or others) in the query, redirect to the view with a wallet address
    if (typeof userAddress === 'undefined' && dynamicWalletAddress) {
      goToOwnWalletView()
    }
  }, [dynamicWalletAddress, goToOwnWalletView, userAddress])

  const isViewingOwnWallet = useMemo(
    () => userAddress === dynamicWalletAddress,
    [userAddress, dynamicWalletAddress],
  )

  const claimButtonDisabled = useMemo(() => {
    if (userRays?.rays?.eligiblePoints === 0 || !isViewingOwnWallet) {
      return true
    }

    return undefined
  }, [isViewingOwnWallet, userRays?.rays?.eligiblePoints])

  return (
    <>
      <ClaimRaysTitle userAddress={userAddress} userRays={userRays} />
      <Text
        as="p"
        variant="p1"
        style={{ color: 'var(--color-neutral-80)', marginBottom: 'var(--space-l)' }}
      >
        Over 2 million DeFi users are eligible for Summer.fi Rays.
      </Text>
      <CriteriaList userRays={userRays} />

      {typeof userAddress !== 'undefined' && isViewingOwnWallet && (
        <Button
          disabled={claimButtonDisabled}
          variant="primaryLarge"
          style={{ marginTop: 'var(--space-l)', marginBottom: 'var(--space-s)' }}
          onClick={goToClaimedView}
        >
          Claim $RAYS
        </Button>
      )}

      {typeof userAddress !== 'undefined' && !isViewingOwnWallet && !dynamicWalletAddress && (
        <Button
          variant="primaryLarge"
          style={{ marginTop: 'var(--space-l)', marginBottom: 'var(--space-s)' }}
          onClick={() => {
            void connect().then(() => {
              goToOwnWalletView()
            })
          }}
        >
          Connect wallet
        </Button>
      )}

      {typeof userAddress !== 'undefined' && !isViewingOwnWallet && dynamicWalletAddress && (
        <Button
          variant="secondaryLarge"
          style={{ marginTop: 'var(--space-l)', marginBottom: 'var(--space-s)' }}
          onClick={goToOwnWalletView}
        >
          View your points
        </Button>
      )}
      {typeof userAddress === 'undefined' && (
        <Button
          variant="primaryLarge"
          style={{ marginTop: 'var(--space-l)', marginBottom: 'var(--space-xxxl)' }}
          onClick={() => connect()}
        >
          Connect wallet
        </Button>
      )}
    </>
  )
}
