'use client'
import { type FC, useReducer, useRef } from 'react'
import { useChain } from '@account-kit/react'
import {
  Button,
  Icon,
  Modal,
  Sidebar,
  type SidebarProps,
  useMobileCheck,
  WithArrow,
} from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { getTransakConfig } from '@/features/transak/config'
import { getTransakPrimaryButtonDisabled } from '@/features/transak/helpers/get-primary-button-disabled'
import { getTransakPrimaryButtonHidden } from '@/features/transak/helpers/get-primary-button-hidden'
import { getTransakPrimaryButtonLabel } from '@/features/transak/helpers/get-primary-button-label'
import { getTransakContent } from '@/features/transak/helpers/get-transak-content'
import { getTransakTitle } from '@/features/transak/helpers/get-transak-title'
import { transakInitialReducerState, transakReducer } from '@/features/transak/state'
import { type TransakPaymentOptions, TransakSteps } from '@/features/transak/types'

const waitOneSecond = new Promise<void>((resolve) => {
  setTimeout(resolve, 1000)
})

const data = ({
  fiatAmount,
  productsAvailed,
  paymentMethod,
  cryptoCurrencyCode,
  fiatCurrency,
}: {
  fiatAmount: string
  productsAvailed: 'BUY' | 'SELL'
  paymentMethod: TransakPaymentOptions
  cryptoCurrencyCode: string
  fiatCurrency: string
}) => ({
  // userData: {
  //   firstName: 'Satushi',
  //   lastName: 'Nakamotos',
  //   mobileNumber: '+15417543010',
  //   dob: '1994-08-26',
  //   email,
  //   address: {
  //     addressLine1: '170 Pine St',
  //     addressLine2: 'San Francisco',
  //     city: 'San Francisco',
  //     state: 'CA',
  //     postCode: '94111',
  //     countryCode: 'US',
  //   },
  // },
  fiatAmount: Number(fiatAmount),
  cryptoCurrencyCode,
  productsAvailed,
  paymentMethod,
  fiatCurrency,
  hideExchangeScreen: true,
  themeColor: 'FF49A4FF',
  containerId: 'transak-dialog',
})

interface TransakWidgetProps {
  cryptoCurrency: string
  isOpen: boolean
  onClose: () => void
  walletAddress: string
  email?: string
}

export const TransakWidget: FC<TransakWidgetProps> = ({
  cryptoCurrency,
  walletAddress,
  email,
  isOpen,
  onClose,
}) => {
  const { chain } = useChain()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const isSKDInit = useRef(false)
  const [state, dispatch] = useReducer(transakReducer, {
    ...transakInitialReducerState,
    cryptoCurrency,
  })

  const { step, fiatAmount, fiatCurrency, paymentMethod } = state

  const handleOpen = () => {
    if (!isSKDInit.current) {
      const transak = getTransakConfig({
        config: {
          walletAddress,
          disableWalletAddressForm: true,
          network: chain.name.toLowerCase(),
          email,
          ...data({
            fiatAmount,
            fiatCurrency,
            paymentMethod,
            cryptoCurrencyCode: 'USDC',
            productsAvailed: 'BUY',
          }),
        },
      })

      isSKDInit.current = true
      transak.init()
    }
  }

  const sidebarProps: SidebarProps = {
    title: getTransakTitle({ step }),
    content: getTransakContent({ step, dispatch, state, isMobile }),
    primaryButton: {
      label: getTransakPrimaryButtonLabel({ step }),
      action: async () => {
        switch (step) {
          case TransakSteps.INITIAL:
            return dispatch({ type: 'update-step', payload: TransakSteps.ABOUT_KYC })
          case TransakSteps.ABOUT_KYC:
            return dispatch({ type: 'update-step', payload: TransakSteps.EXCHANGE })
          case TransakSteps.EXCHANGE:
            dispatch({ type: 'update-step', payload: TransakSteps.KYC })
            await waitOneSecond

            return handleOpen()
          default:
            // eslint-disable-next-line no-console
            console.log('No action defined')

            return undefined
        }
      },
      hidden: getTransakPrimaryButtonHidden({ step }),
      disabled: getTransakPrimaryButtonDisabled({ step, state }),
    },
    footnote: (
      <Link href="https://transak.com/" target="_blank">
        <WithArrow withStatic style={{ color: 'var(--earn-protocol-primary-100)' }}>
          Lean more about KYC
        </WithArrow>
      </Link>
    ),
    isMobile,
  }

  return isMobile ? (
    <Sidebar
      {...sidebarProps}
      drawerOptions={{ slideFrom: 'right', forceMobileOpen: isOpen, closeDrawer: onClose }}
    />
  ) : (
    <Modal openModal={isOpen} closeModal={onClose}>
      <Sidebar {...sidebarProps} />
      <Button
        variant="unstyled"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '23px',
          right: '15px',
          height: '30px',
          padding: '5px 10px',
          cursor: 'pointer',
        }}
      >
        <Icon iconName="close" variant="xs" color="var(--earn-protocol-secondary-40)" />
      </Button>
    </Modal>
  )
}
