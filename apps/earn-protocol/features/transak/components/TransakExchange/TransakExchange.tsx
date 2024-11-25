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
import { type TransakReducerAction, type TransakReducerState } from '@/features/transak/types'

import classNames from './TransakExchange.module.scss'

const fiatOptions: DropdownOption[] = [
  {
    label: 'USD',
    iconName: 'not_supported_icon',
    value: 'USD',
  },
  {
    label: 'EUR',
    iconName: 'not_supported_icon',
    value: 'EUR',
  },
]

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
  } = state

  const handleInputChange = debounce((value: string) => {
    dispatch({ type: 'update-fiat-amount', payload: value })
    if (!value) {
      dispatch({ type: 'update-exchange-details', payload: undefined })
      dispatch({ type: 'update-error', payload: '' })
    }
  }, 300)

  useEffect(() => {
    const fetchExchangeDetails = async () => {
      const data = await fetch(
        getTransakPricingUrl({
          fiatCurrency,
          cryptoCurrency,
          fiatAmount,
          isBuyOrSell,
          network,
          paymentMethod,
        }),
      ).then((resp) => {
        if (resp.status === 504) {
          throw new Error('Failed to fetch exchange details, please refresh and try again.')
        }

        return resp.json()
      })

      if (data.response) {
        dispatch({ type: 'update-exchange-details', payload: data.response })

        // eslint-disable-next-line no-console
        console.log('exchange details', data.response)
      }

      if (data.error) {
        dispatch({ type: 'update-error', payload: data.error.message })
      }
    }

    if (fiatAmount && fiatAmount !== '0') {
      try {
        dispatch({ type: 'update-error', payload: '' })

        dispatch({ type: 'update-exchange-details', payload: undefined })
        void fetchExchangeDetails()
      } catch (e) {
        dispatch({ type: 'update-error', payload: `${e}` })
        // eslint-disable-next-line no-console
        console.error('Error reading exchange details', e)
      }
    }
  }, [fiatAmount, fiatCurrency, cryptoCurrency, isBuyOrSell, paymentMethod, network, dispatch])

  return (
    <div className={classNames.wrapper}>
      <TransakExchangeInput
        label="You pay"
        onInputChange={handleInputChange}
        onOptionChange={(value) => dispatch({ type: 'update-fiat-currency', payload: value })}
        options={fiatOptions}
      />
      {error && (
        <Text as="p" variant="p3" className={classNames.error}>
          {error}
        </Text>
      )}
      <div className={classNames.middleSection}>
        <div className={classNames.line} />
        <div className={classNames.dot} />
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
          style={{
            color: 'var(--earn-protocol-secondary-60)',
            marginBottom: 'var(--general-space-12)',
          }}
        >
          Using payment method
        </Text>
        <div className={classNames.paymentMethodsWrapper}>
          <TransakPaymentMethods
            onChange={(method) => dispatch({ type: 'update-payment-method', payload: method })}
            defaultMethod={paymentMethod}
          />
        </div>
        <Text
          as="p"
          variant="p4semi"
          className={classNames.showDetails}
          onClick={() => setShowDetails((prev) => !prev)}
        >
          Show calculation
        </Text>
        {showDetails && (
          <TransakExchangeDetails details={exchangeDetails} fiatCurrency={fiatCurrency} />
        )}
      </div>
      <TransakExchangeInput
        label="You receive (estimate)"
        readOnly
        defaultValue={exchangeDetails?.cryptoAmount.toString()}
        defaultOption={cryptoOptions.find((item) => item.value === cryptoCurrency)}
        onOptionChange={(value) => dispatch({ type: 'update-crypto-currency', payload: value })}
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
