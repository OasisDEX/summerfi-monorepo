import { type Dispatch, type FC, useEffect, useState } from 'react'
import { Icon, Text, Tooltip, useMobileCheck } from '@summerfi/app-earn-ui'
import { type DropdownOption } from '@summerfi/app-types'
import debounce from 'lodash-es/debounce'
import { useParams } from 'next/navigation'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { TransakExchangeDetails } from '@/features/transak/components/TransakExchangeDetails/TransakExchangeDetails'
import { TransakExchangeInput } from '@/features/transak/components/TransakExchangeInput/TransakExchangeInput'
import { TransakPaymentMethods } from '@/features/transak/components/TransakPaymentMethods/TransakPaymentMethods'
import { transakPaymentMethods } from '@/features/transak/consts'
import { getTransakPricingUrl } from '@/features/transak/helpers/get-transak-pricing-url'
import {
  type TransakPaymentOptions,
  type TransakReducerAction,
  type TransakReducerState,
} from '@/features/transak/types'

import classNames from './TransakExchange.module.scss'

const cryptoOptions: DropdownOption[] = [
  {
    label: 'USDC',
    tokenSymbol: 'USDC',
    value: 'USDC',
  },
  {
    label: 'DAI',
    tokenSymbol: 'DAI',
    value: 'DAI',
  },
  {
    label: 'ETH',
    tokenSymbol: 'ETH',
    value: 'ETH',
  },
]

interface TransakExchangeProps {
  dispatch: Dispatch<TransakReducerAction>
  state: TransakReducerState
}

export const TransakExchange: FC<TransakExchangeProps> = ({ dispatch, state }) => {
  const params = useParams()
  const { network: rawNetwork } = params
  const network = rawNetwork as string
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const [showDetails, setShowDetails] = useState(false)

  const {
    fiatAmount,
    isBuyOrSell,
    fiatCurrency,
    cryptoCurrency,
    paymentMethod,
    exchangeDetails,
    error,
    ipCountryCode,
    fiatCurrencies,
  } = state

  useEffect(() => {
    const fetchExchangeDetails = async () => {
      try {
        const response = await fetch(
          getTransakPricingUrl({
            fiatCurrency,
            cryptoCurrency,
            fiatAmount,
            isBuyOrSell,
            network,
            paymentMethod,
            ipCountryCode,
          }),
        )

        if (response.status === 504) {
          throw new Error('Request timeout. Please try again.')
        }

        const data = await response.json()

        if (data.response) {
          dispatch({ type: 'update-exchange-details', payload: data.response })
        }
        if (data.error) {
          // filter out errors that we are handling on the UI and which seems to be bugged
          // for example API says that min amount for GBP is 2, but based on fiatCurrencies response
          // for gbp_bank_transfer it's 16
          if (data.error.message.includes('Minimum') || data.error.message.includes('less than')) {
            return
          }

          dispatch({ type: 'update-error', payload: data.error.message })
        }
      } catch (e) {
        dispatch({ type: 'update-error', payload: `${e}` })
      }
    }

    if (fiatAmount && fiatAmount !== '0') {
      // dispatch({ type: 'update-error', payload: '' })
      dispatch({ type: 'update-exchange-details', payload: undefined })

      void fetchExchangeDetails()
    }
  }, [
    fiatAmount,
    fiatCurrency,
    cryptoCurrency,
    isBuyOrSell,
    paymentMethod,
    network,
    dispatch,
    ipCountryCode,
  ])

  if (fiatCurrencies === undefined) {
    // at this point it should be always defined
    // condition added to avoid typescript issues
    return null
  }

  const handleInputChange = debounce((value: string) => {
    dispatch({ type: 'update-error', payload: '' })

    const amount = value.replaceAll(',', '')

    dispatch({ type: 'update-fiat-amount', payload: amount })

    // when fiat currency being changed, align payment method to the first available
    const paymentMethodData = fiatCurrencies
      .find((item) => item.symbol === state.fiatCurrency)
      ?.paymentOptions.find((item) => item.id === state.paymentMethod)

    const maxAmount = paymentMethodData?.maxAmount
    const minAmount = paymentMethodData?.minAmount

    if (maxAmount && Number(amount) >= maxAmount) {
      dispatch({
        type: 'update-error',
        payload: `Maximum amount for this payment method is ${maxAmount}`,
      })
    }

    if (minAmount && Number(amount) <= minAmount) {
      dispatch({
        type: 'update-error',
        payload: `Minimum amount for this payment method is ${minAmount}`,
      })
    }

    if (!value) {
      dispatch({ type: 'update-exchange-details', payload: undefined })
      dispatch({ type: 'update-error', payload: '' })
    }
  }, 400)

  const paymentMethods = fiatCurrencies
    .find((item) => item.symbol === state.fiatCurrency)
    ?.paymentOptions.map((item) => ({ value: item.id as TransakPaymentOptions, label: item.name }))

  if (paymentMethods === undefined) {
    // at this point it should be always defined
    return null
  }

  const fiatOptions = fiatCurrencies.map((item) => ({
    icon: item.icon,
    label: item.symbol,
    value: item.symbol,
  }))

  return (
    <div className={classNames.wrapper}>
      <TransakExchangeInput
        label="You pay"
        onInputChange={handleInputChange}
        onOptionChange={(value) => {
          dispatch({ type: 'update-fiat-currency', payload: value })
          dispatch({ type: 'update-error', payload: '' })

          // when fiat currency being changed, align payment method to the first available
          const newPaymentMethod = fiatCurrencies.find((item) => item.symbol === value)
            ?.paymentOptions[0].id

          if (newPaymentMethod) {
            dispatch({ type: 'update-payment-method', payload: newPaymentMethod })
          }
        }}
        options={fiatOptions}
        defaultOption={fiatOptions.find((item) => item.value === state.fiatCurrency)}
      />
      {error && (
        <Text as="p" variant="p3" className={classNames.error}>
          {error}
        </Text>
      )}
      <div className={classNames.middleSection}>
        <div className={classNames.line} />
        <div className={classNames.dot} />
        <Text
          as="p"
          variant="p4semi"
          style={{
            color: 'var(--earn-protocol-secondary-60)',
            marginBottom: 'var(--general-space-12)',
          }}
        >
          Using payment method
        </Text>
        <div className={classNames.paymentMethodsWrapper}>
          <TransakPaymentMethods
            onChange={(method) => {
              dispatch({ type: 'update-error', payload: '' })
              dispatch({ type: 'update-payment-method', payload: method })
            }}
            defaultMethod={paymentMethod}
            paymentMethods={paymentMethods}
          />
        </div>
        <div className={classNames.showDetailsWrapper}>
          <div
            className={classNames.detailsCircleBtn}
            onClick={() => setShowDetails((prev) => !prev)}
          >
            <Text as="span" style={{ color: 'var(--earn-protocol-secondary-70)' }}>
              {showDetails ? '-' : '+'}
            </Text>
          </div>
          <Text
            as="p"
            variant="p4semi"
            className={classNames.showDetails}
            onClick={() => setShowDetails((prev) => !prev)}
          >
            Show calculation
          </Text>
        </div>

        {showDetails && (
          <TransakExchangeDetails details={exchangeDetails} fiatCurrency={fiatCurrency} />
        )}
      </div>
      <TransakExchangeInput
        label="You receive (estimate)"
        readOnly
        defaultValue={exchangeDetails?.cryptoAmount.toString()}
        defaultOption={cryptoOptions.find((item) => item.value === cryptoCurrency)}
        onOptionChange={(value) => {
          dispatch({ type: 'update-error', payload: '' })
          dispatch({ type: 'update-crypto-currency', payload: value })
        }}
        options={cryptoOptions}
      />
      <div className={classNames.extraInfoWrapper}>
        <div className={classNames.slippageWrapper}>
          <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
            Slippage {exchangeDetails?.slippage ?? '-'}%
          </Text>
          <Tooltip tooltip="Lorem ipsum doler slarem" withinDialog={!isMobile}>
            <Icon iconName="question_o" variant="xs" color="var(--earn-protocol-secondary-100)" />
          </Tooltip>
        </div>
        <div className={classNames.averageProcessingTimeWrapper}>
          <Icon iconName="clock" variant="s" color="var(--earn-protocol-secondary-40)" />
          <div className={classNames.textual}>
            <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Average Processing Time:{' '}
            </Text>
            <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
              {transakPaymentMethods.find((method) => method.id === paymentMethod)
                ?.processingTime ?? '-'}
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}