'use client'
import { useCallback, useEffect, useState } from 'react'
import { useLogout, useSigner, useUser } from '@alchemy/aa-alchemy/react'
import { fetchRisk } from '@summerfi/app-risk'
import { type TOSSignMessage, useTermsOfService } from '@summerfi/app-tos'
import { TOSStatus } from '@summerfi/app-types'
import { Card, Modal, TermsOfService } from '@summerfi/app-ui'
import { useAppState, useConnectWallet } from '@web3-onboard/react'
import { type Config as WagmiConfig, signMessage as signMessageWagmi } from '@web3-onboard/wagmi'

import { AccountKitAddOwner } from '@/components/molecules/AccountKitAddOwner/AccountKitAddOwner'
import { AccountKitClient } from '@/components/molecules/AccountKitClient/AccountKitClient'
import { AccountKitExportPrivateKey } from '@/components/molecules/AccountKitExportPrivateKey/AccountKitExportPrivateKey'
import { AccountKitLogin } from '@/components/molecules/AccountKitLogin/AccountKitLogin'
import { AccountKitSendUserOperation } from '@/components/molecules/AccountKitSendUserOperation/AccountKitSendUserOperation'
import { AccountKitAddPassKey } from '@/components/molecules/AcountKitAddPassKey/AccountKitAddPassKey'
import { TransakOneWidget } from '@/components/molecules/TransakOneWidget/TransakOneWidget'
import { TransakWidget } from '@/components/molecules/TransakWidget/TransakWidget'

const AccountKitFeatures = () => {
  const signer = useSigner()
  const user = useUser()
  const { wagmiConfig } = useAppState()
  const [{ wallet }] = useConnectWallet()

  const { logout } = useLogout()

  // Dummy ToS & TRM logic for now
  const signMessage: TOSSignMessage = useCallback(
    async (data: string) => {
      // Signer from MM
      if (wallet.wagmiConnector != null) {
        return await signMessageWagmi(wagmiConfig as WagmiConfig, {
          message: data,
          connector: wallet?.wagmiConnector,
        })
      }
      // Signer from Account Kit
      else return await signer?.signMessage(data)
    },
    [signer, wallet, wagmiConfig],
  )

  const [openModal, setOpenModal] = useState(false)

  const walletAddress = user?.address

  const tosState = useTermsOfService({
    signMessage,
    chainId: 1,
    walletAddress,
    isGnosisSafe: false,
    version: 'version-26.06.2023',
  })

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

    if (tosState.status === TOSStatus.DONE && openModal) {
      void fetchRisk({ chainId: 1, walletAddress })
      setOpenModal(false)
    }

    if (!walletAddress) {
      setOpenModal(false)
    }
  }, [tosState.status, openModal, walletAddress])

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
      Account kit features
      <AccountKitLogin />
      {user && (
        <div>
          <p>Logged user: {user.email}</p>
          <p>Logged user signer address: {user.address}</p>
        </div>
      )}
      {signer && user && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
            <AccountKitAddPassKey /> (Optional)
          </div>
          <AccountKitExportPrivateKey signer={signer} />
          <AccountKitClient />
          <AccountKitSendUserOperation />
          <AccountKitAddOwner />
          <TransakWidget />
          <TransakOneWidget />
        </>
      )}
    </div>
  )
}

export default AccountKitFeatures
