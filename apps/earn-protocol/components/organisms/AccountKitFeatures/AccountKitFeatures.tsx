'use client'
import { useCallback, useEffect, useState } from 'react'
import { useLogout, useSigner, useUiConfig, useUser } from '@account-kit/react'
import { Card, Modal, TermsOfService } from '@summerfi/app-earn-ui'
import { fetchRisk } from '@summerfi/app-risk'
import { type TOSSignMessage, useTermsOfService } from '@summerfi/app-tos'
import { TOSStatus } from '@summerfi/app-types'

import { TransakOneWidget } from '@/components/molecules/TransakOneWidget/TransakOneWidget'

export const AccountKitFeatures = () => {
  const signer = useSigner()
  const user = useUser()
  const { isModalOpen } = useUiConfig()
  const { logout } = useLogout()

  // Dummy ToS & TRM logic for now
  const signMessage: TOSSignMessage = useCallback(
    async (data: string) => {
      if (signer) {
        return await signer.signMessage(data)
      }

      return undefined
    },
    [signer],
  )

  const [openModal, setOpenModal] = useState(false)

  const walletAddress = user?.address

  const tosState = useTermsOfService({
    signMessage,
    chainId: 1,
    walletAddress,
    isGnosisSafe: false,
    version: 'version-26.06.2023',
    cookiePrefix: 'test',
  })

  useEffect(() => {
    if (
      [
        TOSStatus.WAITING_FOR_SIGNATURE,
        TOSStatus.WAITING_FOR_ACCEPTANCE,
        TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED,
      ].includes(tosState.status) &&
      !openModal &&
      walletAddress &&
      !isModalOpen
    ) {
      setOpenModal(true)
    }

    if (tosState.status === TOSStatus.DONE && openModal) {
      void fetchRisk({ chainId: 1, walletAddress })
      setOpenModal(false)
    }

    if (!walletAddress) {
      setOpenModal(false)
    }
  }, [tosState.status, openModal, walletAddress, isModalOpen])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '24px' }}>
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
            disconnect={() => {
              setOpenModal(false)
              logout()
            }}
            tosState={tosState}
          />
        </Card>
      </Modal>
      {user && <TransakOneWidget />}
    </div>
  )
}
