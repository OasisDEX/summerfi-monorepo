'use client'
import { useEffect, useRef, useState } from 'react'
import { useChain, useUser } from '@account-kit/react'
import { Button } from '@summerfi/app-earn-ui'

import { getTransakConfig } from '@/transak/config'

function validateEmail(email: string) {
  // eslint-disable-next-line require-unicode-regexp
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailRegex.test(email)
}

const data = (email: string, fiatAmount: string) => ({
  userData: {
    firstName: 'Satushi',
    lastName: 'Nakamotos',
    mobileNumber: '+15417543010',
    dob: '1994-08-26',
    email,
    address: {
      addressLine1: '170 Pine St',
      addressLine2: 'San Francisco',
      city: 'San Francisco',
      state: 'CA',
      postCode: '94111',
      countryCode: 'US',
    },
  },
  hideExchangeScreen: true,
  fiatCurrency: 'USD',
  cryptoCurrencyCode: 'USDC',
  fiatAmount: Number(fiatAmount),
  productsAvailed: 'BUY',
  paymentMethod: 'credit_debit_card',
  themeColor: 'FF49A4FF',
  containerId: 'transak-dialog',
})

export const TransakWidget = () => {
  const { chain } = useChain()
  const user = useUser()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isSKDInit = useRef(false)

  const [email, setEmail] = useState<string>('')
  const [fiatAmount, setFiatAmount] = useState<string>('')

  useEffect(() => {
    if (user?.email && email === '') {
      setEmail(user.email)
    }
  }, [user?.email, email])

  if (!user) {
    return null
  }

  // Function to open the dialog
  const openDialog = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // triggerUrl()
    if (dialogRef.current) {
      dialogRef.current.showModal()
    }
  }

  const handleOpen = () => {
    if (!isSKDInit.current) {
      const transak = getTransakConfig({
        config: {
          walletAddress: user.address,
          disableWalletAddressForm: true,
          network: chain.name.toLowerCase(),
          email,
          ...data(email, fiatAmount),
        },
      })

      isSKDInit.current = true
      transak.init()
    }
  }

  // Function to close the dialog
  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close()
    }
  }

  return (
    <>
      <Button variant="primarySmall" onClick={openDialog} style={{ width: 'fit-content' }}>
        Transak On/Off-Ramp
      </Button>

      <dialog
        ref={dialogRef}
        style={{
          border: 'none',
          borderRadius: '10px',
          padding: '24px',
          overflow: 'hidden',
          backgroundColor: '#333d4b',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              padding: '10px',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              minWidth: '300px',
            }}
          >
            <p>Predefined fields:</p>
            <pre style={{ padding: '10px', margin: 0, fontSize: '12px' }}>
              {JSON.stringify(data(email, fiatAmount), null, 2)}
            </pre>
            <input
              type="email"
              placeholder="E-mail"
              style={{ width: '100%' }}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="number"
              placeholder="Fiat amount"
              style={{ width: '100%' }}
              onChange={(e) => setFiatAmount(e.target.value)}
              value={fiatAmount}
            />
            <Button
              variant="primarySmall"
              onClick={handleOpen}
              disabled={!validateEmail(email) || fiatAmount === ''}
              style={{
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              Run transak widget
            </Button>
          </div>
          <div id="transak-dialog" style={{ width: '500px', height: '800px' }} />
          <Button
            variant="primarySmall"
            onClick={closeDialog}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              height: '30px',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            X
          </Button>
        </div>
      </dialog>
    </>
  )
}
