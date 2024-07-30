'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRisk } from '@summerfi/app-risk'
import { type TOSSignMessage, useTermsOfService } from '@summerfi/app-tos'
import { type RaysApiResponse, TOSStatus } from '@summerfi/app-types'
import { Button, Card, Modal, TermsOfService, Text } from '@summerfi/app-ui'
import { useConnectWallet } from '@web3-onboard/react'
import { BrowserProvider } from 'ethers'
import { usePathname, useRouter } from 'next/navigation'

import { ClaimRaysTitle } from '@/components/molecules/ClaimRaysTitle/ClaimRaysTitle'
import { CriteriaList } from '@/components/molecules/CriteriaList/CriteriaList'
import { CalculatorModal } from '@/components/organisms/CalculatorModal/CalculatorModal'
import { trackButtonClick } from '@/helpers/mixpanel'
import { useClientSideMount } from '@/helpers/use-client-side-mount'

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

  // create an ethers provider
  let ethersProvider: BrowserProvider | undefined

  if (wallet) {
    ethersProvider = new BrowserProvider(wallet.provider)
  }

  ethersProvider?.getSigner()

  const signMessage: TOSSignMessage = useCallback(
    async (data: string) => {
      const signer = await ethersProvider?.getSigner()

      return await signer?.signMessage(data)
    },
    [wallet?.provider],
  )

  const [openModal, setOpenModal] = useState(false)

  const walletAddress = wallet?.accounts[0].address

  const risk = useRisk({ walletAddress, chainId: 1, host: 'http://localhost:3000' })

  // eslint-disable-next-line no-console
  console.log('risk', risk)

  const tosState = useTermsOfService({
    signMessage,
    chainId: 1,
    walletAddress,
    isGnosisSafe: false,
    version: 'version-26.06.2023',
    host: 'http://localhost:3000',
  })

  // eslint-disable-next-line no-console
  console.log('tosState', tosState)
  useEffect(() => {
    if (
      [
        TOSStatus.WAITING_FOR_SIGNATURE,
        TOSStatus.WAITING_FOR_ACCEPTANCE,
        TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED,
      ].includes(tosState.status) &&
      !openModal &&
      walletAddress
    ) {
      setOpenModal(true)
    }

    if (tosState.status === TOSStatus.DONE) {
      setOpenModal(false)
    }
  }, [tosState.status, openModal, walletAddress])

  return (
    <>
      <Modal openModal={openModal} disableCloseOutside closeModal={() => null}>
        <Card
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '370px',
          }}
        >
          <TermsOfService
            documentLink="/"
            disconnect={() => setOpenModal(false)}
            tosState={tosState}
          />
        </Card>
      </Modal>
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
