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
  const { replace } = useRouter()
  const currentPath = usePathname()

  const dynamicWalletAddress = useMemo(() => wallet?.accounts[0].address, [wallet?.accounts])

  const goToOwnWalletView = useCallback(() => {
    replace(`${currentPath}?userAddress=${dynamicWalletAddress}`)
  }, [currentPath, dynamicWalletAddress, replace])

  useEffect(() => {
    // if user is connected and is visiting a page without wallet
    // address (its or others) in the query, redirect to the view with a wallet address
    if (typeof userAddress === 'undefined' && (wallet?.accounts.length ?? 0) > 0) {
      goToOwnWalletView()
    }
  }, [currentPath, goToOwnWalletView, replace, userAddress, wallet?.accounts])

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
      {typeof userAddress !== 'undefined' ? (
        <>
          <Button
            disabled={claimButtonDisabled}
            variant="primaryLarge"
            style={{ marginTop: 'var(--space-l)', marginBottom: 'var(--space-s)' }}
            onClick={() => {
              // eslint-disable-next-line no-alert
              alert('Claimed!')
            }}
          >
            Claim $RAYS
          </Button>
          {!dynamicWalletAddress && (
            <Button
              variant="primarySmall"
              style={{ marginTop: 'var(--space-xs)', marginBottom: 'var(--space-xxxl)' }}
              onClick={() => connect()}
            >
              Connect wallet
            </Button>
          )}
        </>
      ) : (
        <Button
          variant="primaryLarge"
          style={{ marginTop: 'var(--space-l)', marginBottom: 'var(--space-xxxl)' }}
          onClick={() => connect()}
        >
          Connect wallet
        </Button>
      )}
      {typeof userAddress !== 'undefined' && !isViewingOwnWallet && dynamicWalletAddress && (
        <Button
          variant="primarySmall"
          style={{ marginBottom: 'var(--space-xxxl)' }}
          onClick={goToOwnWalletView}
        >
          View your $RAYS
        </Button>
      )}
    </>
  )
}
