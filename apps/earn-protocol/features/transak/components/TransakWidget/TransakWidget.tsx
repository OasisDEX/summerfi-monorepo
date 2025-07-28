'use client'
import { type FC, useEffect, useReducer, useState } from 'react'
import { useChain } from '@account-kit/react'
import { Modal, Sidebar, type SidebarProps, useMobileCheck } from '@summerfi/app-earn-ui'
import { SupportedNetworkIds } from '@summerfi/app-types'
import { Transak } from '@transak/transak-sdk'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { getTransakConfig } from '@/features/transak/config'
import { getTransakFiatCurrency } from '@/features/transak/countries'
import { getTransakConfigInitData } from '@/features/transak/helpers/get-transak-config-init-data'
import { getTransakContent } from '@/features/transak/helpers/get-transak-content'
import { getTransakFiatCurrencies } from '@/features/transak/helpers/get-transak-fiat-currencies'
import { getTransakFootnote } from '@/features/transak/helpers/get-transak-footnote'
import { getTransakIpCountryCode } from '@/features/transak/helpers/get-transak-ip-country-code'
import { getTransakIsLoading } from '@/features/transak/helpers/get-transak-is-loading'
import { getTransakOrder } from '@/features/transak/helpers/get-transak-order'
import { getTransakPrimaryButtonDisabled } from '@/features/transak/helpers/get-transak-primary-button-disabled'
import { getTransakPrimaryButtonHidden } from '@/features/transak/helpers/get-transak-primary-button-hidden'
import { getTransakPrimaryButtonLabel } from '@/features/transak/helpers/get-transak-primary-button-label'
import { getTransakRefreshToken } from '@/features/transak/helpers/get-transak-refresh-token'
import { getTransakTitle } from '@/features/transak/helpers/get-transak-title'
import { waitTransakOneSecond } from '@/features/transak/helpers/wait-for-second'
import { transakInitialReducerState, transakReducer } from '@/features/transak/state'
import {
  TransakAction,
  type TransakEventOrderData,
  type TransakNetworkOption,
  TransakOrderDataStatus,
  TransakSteps,
} from '@/features/transak/types'

interface TransakWidgetProps {
  cryptoCurrency: string
  isOpen: boolean
  onClose: () => void
  walletAddress: string
  email?: string
  injectedNetwork?: TransakNetworkOption
}

export const TransakWidget: FC<TransakWidgetProps> = ({
  cryptoCurrency,
  walletAddress,
  email,
  isOpen,
  onClose,
  injectedNetwork,
}) => {
  const { chain } = useChain()
  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)
  const [transakInstance, setTransakInstance] = useState<Transak | null>(null)
  const [state, dispatch] = useReducer(transakReducer, {
    ...transakInitialReducerState,
    cryptoCurrency,
  })

  const { step, fiatAmount, fiatCurrency, paymentMethod, eventOrderData } = state

  const resolvedChainId = (
    injectedNetwork ? injectedNetwork.chainId : chain.id
  ) as SupportedNetworkIds

  useEffect(() => {
    if (isOpen) {
      void getTransakRefreshToken()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && !state.ipCountryCode) {
      void getTransakIpCountryCode().then((resp) => {
        dispatch({ type: 'update-ip-country-code', payload: resp?.ipCountryCode })
        dispatch({
          type: 'update-fiat-currency',
          payload: getTransakFiatCurrency(resp?.ipCountryCode),
        })
      })
    }
  }, [isOpen, state.ipCountryCode, state.fiatCurrencies])

  useEffect(() => {
    if (isOpen && !state.fiatCurrencies) {
      void getTransakFiatCurrencies().then((resp) =>
        dispatch({ type: 'update-fiat-currencies', payload: resp?.response }),
      )
    }
  }, [isOpen, state.fiatCurrencies])

  useEffect(() => {
    if (eventOrderData && isOpen) {
      const polling = setInterval(
        () =>
          getTransakOrder({ orderId: eventOrderData.status.id })
            .then((resp) => {
              dispatch({ type: 'update-order-data', payload: resp })
              if (resp.data.status === TransakOrderDataStatus.COMPLETED) {
                clearInterval(polling)
              }
            })
            .catch((er) => {
              clearInterval(polling)
              dispatch({ type: 'update-error', payload: 'Error fetching Transak order' })
              // eslint-disable-next-line no-console
              console.error('Error fetching Transak order:', er)
            }),
        5000,
      )

      return () => clearInterval(polling)
    }

    return () => null
  }, [eventOrderData, isOpen])

  useEffect(() => {
    if (transakInstance) {
      Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (data) => {
        dispatch({ type: 'update-event-order-data', payload: data as TransakEventOrderData })
        transakInstance.cleanup()
        dispatch({ type: 'update-step', payload: TransakSteps.ORDER })
      })

      return () => {
        transakInstance.cleanup()
      }
    }

    return () => null
  }, [transakInstance])

  const handleOpen = () => {
    const transak = getTransakConfig({
      config: {
        walletAddress,
        disableWalletAddressForm: true,
        network: {
          [SupportedNetworkIds.Mainnet]: 'ethereum',
          [SupportedNetworkIds.Base]: 'base',
          [SupportedNetworkIds.SonicMainnet]: 'sonic',
          [SupportedNetworkIds.ArbitrumOne]: 'arbitrum',
          [SupportedNetworkIds.Optimism]: 'optimism',
        }[resolvedChainId],
        email,
        ...getTransakConfigInitData({
          fiatAmount,
          fiatCurrency,
          paymentMethod,
          cryptoCurrencyCode: state.cryptoCurrency,
          productsAvailed: TransakAction.BUY,
        }),
      },
    })

    transak.init()
    setTransakInstance(transak)
  }

  const sidebarProps: SidebarProps = {
    title: getTransakTitle({ state }),
    content: getTransakContent({
      dispatch,
      state,
      isMobile,
      injectedNetworkValue: injectedNetwork?.value,
    }),
    primaryButton: {
      label: getTransakPrimaryButtonLabel({ state }),
      action: async () => {
        switch (step) {
          case TransakSteps.INITIAL:
            return dispatch({ type: 'update-step', payload: TransakSteps.ABOUT_KYC })
          case TransakSteps.ABOUT_KYC:
            if (chain.id === SupportedNetworkIds.Mainnet && !injectedNetwork) {
              return dispatch({ type: 'update-step', payload: TransakSteps.SWITCH_TO_L2 })
            }

            return dispatch({ type: 'update-step', payload: TransakSteps.EXCHANGE })
          case TransakSteps.BUY_ETH:
            dispatch({ type: 'update-crypto-currency', payload: 'ETH' })

            return dispatch({ type: 'update-step', payload: TransakSteps.EXCHANGE })
          case TransakSteps.EXCHANGE:
            dispatch({ type: 'update-step', payload: TransakSteps.KYC })
            await waitTransakOneSecond

            return handleOpen()
          case TransakSteps.ORDER:
            return onClose()
          default:
            // eslint-disable-next-line no-console
            console.log('No action defined')

            return undefined
        }
      },
      hidden: getTransakPrimaryButtonHidden({ step }),
      disabled: getTransakPrimaryButtonDisabled({ state }),
      loading: getTransakIsLoading({ state }),
    },
    footnote: getTransakFootnote({ state, dispatch }),
    isMobileOrTablet: isMobile || isTablet,
  }

  return isMobile ? (
    <Sidebar
      {...sidebarProps}
      drawerOptions={{ slideFrom: 'right', forceMobileOpen: isOpen, closeDrawer: onClose }}
    />
  ) : (
    <Modal openModal={isOpen} closeModal={onClose}>
      <Sidebar {...sidebarProps} />
    </Modal>
  )
}
