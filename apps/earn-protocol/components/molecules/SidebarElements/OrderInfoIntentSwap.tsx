'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useChain, useSmartAccountClient } from '@account-kit/react'
import {
  Button,
  getAccountType,
  Icon,
  LoadingSpinner,
  OrderInformation,
  Text,
} from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import {
  type AddressValue,
  type IntentQuoteData,
  type IToken,
  TokenAmount,
} from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import type { PublicClient } from 'viem'

import { useAppSDK } from '@/hooks/use-app-sdk'

import orderInfoDepositWithdrawStyles from './OrderInfoDepositWithdraw.module.css'

type SwapStep =
  | 'loading_quote'
  | 'quote'
  | 'quote_error'
  | 'sending'
  | 'polling'
  | 'success'
  | 'cancelled'
  | 'expired'
  | 'error'

type OrderInfoIntentSwapProps = {
  fromToken: IToken
  toToken: IToken
  amount: BigNumber
  fleetAddressValue: AddressValue
  chainId: SupportedNetworkIds
  publicClient: PublicClient
  userWalletAddress: AddressValue
  referralCode?: string
  onStartAgain: () => void
}

export const OrderInfoIntentSwap = ({
  fromToken,
  toToken,
  amount,
  fleetAddressValue,
  chainId,
  publicClient,
  userWalletAddress,
  referralCode,
  onStartAgain,
}: OrderInfoIntentSwapProps) => {
  const { chain } = useChain()
  const { client: smartAccountClient } = useSmartAccountClient({
    type: getAccountType(chain.id),
  })
  const {
    getIntentSwapsSellOrderQuote,
    getIntentSwapsSendDepositOrder,
    getIntentSwapsCancelOrder,
    getIntentSwapsCheckOrder,
  } = useAppSDK()

  const [step, setStep] = useState<SwapStep>('loading_quote')
  const [quote, setQuote] = useState<IntentQuoteData | undefined>(undefined)
  const [quoteError, setQuoteError] = useState<string | undefined>(undefined)
  const [orderId, setOrderId] = useState<string | undefined>(undefined)
  const [orderStatus, setOrderStatus] = useState<string | undefined>(undefined)
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  // fetch quote on mount / when inputs change
  useEffect(() => {
    const fetchQuote = async () => {
      setStep('loading_quote')
      setQuoteError(undefined)
      try {
        const fromAmount = TokenAmount.createFrom({
          amount: amount.toString(),
          token: fromToken,
        })
        const result = await getIntentSwapsSellOrderQuote({
          fromAmount,
          toToken,
          sender: userWalletAddress,
        })

        setQuote(result)

        setStep('quote')
      } catch (err) {
        setQuoteError(err instanceof Error ? err.message : 'Failed to get quote')
        setStep('quote_error')
      }
    }

    fetchQuote()
  }, [amount, fromToken, toToken, userWalletAddress, getIntentSwapsSellOrderQuote])

  // poll for order status every 2s
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined

    if (step === 'polling' && orderId) {
      intervalId = setInterval(async () => {
        try {
          const orderInfo = await getIntentSwapsCheckOrder({ chainId, orderId })

          if (!orderInfo) return

          const { status: orderCheckStatus } = orderInfo.order

          setOrderStatus(orderCheckStatus)

          if (orderCheckStatus === 'fulfilled') {
            clearInterval(intervalId)
            setStep('success')
          } else if (orderCheckStatus === 'cancelled') {
            clearInterval(intervalId)
            setStep('cancelled')
          } else if (orderCheckStatus === 'expired') {
            clearInterval(intervalId)
            setStep('expired')
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Error checking order status:', err)
        }
      }, 2000)

      pollingIntervalRef.current = intervalId
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [step, orderId, chainId, getIntentSwapsCheckOrder])

  const handleStartAgain = useCallback(() => {
    onStartAgain()
  }, [onStartAgain])

  const handleConfirmDeposit = useCallback(async () => {
    if (!quote || !smartAccountClient?.account) return

    setStep('sending')
    setError(undefined)

    try {
      const result = await getIntentSwapsSendDepositOrder({
        chainId,
        fleetAddressValue,
        fromAmount: quote.fromAmount,
        toAmount: quote.toAmount,
        sender: userWalletAddress,
        order: quote.order,
        // SmartContractAccount from Account Kit satisfies the Account interface for signing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        viemAccount: smartAccountClient.account as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        publicClient: publicClient as any,
        referralCode: (referralCode ?? '0x') as `0x${string}`,
      })

      setOrderId(result.orderId)
      setOrderStatus('open')
      setStep('polling')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send deposit order')
      setStep('error')
    }
  }, [
    quote,
    smartAccountClient,
    chainId,
    fleetAddressValue,
    userWalletAddress,
    publicClient,
    referralCode,
    getIntentSwapsSendDepositOrder,
  ])

  const handleCancelOrder = useCallback(async () => {
    if (!orderId || !smartAccountClient?.account || isCancelling) return

    setIsCancelling(true)
    try {
      await getIntentSwapsCancelOrder({
        chainId,
        orderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        account: smartAccountClient.account as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        publicClient: publicClient as any,
      })
      clearInterval(pollingIntervalRef.current)
      setStep('cancelled')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error cancelling order:', err)
    } finally {
      setIsCancelling(false)
    }
  }, [orderId, smartAccountClient, chainId, publicClient, getIntentSwapsCancelOrder, isCancelling])

  if (step === 'loading_quote') {
    return (
      <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
        <LoadingSpinner />
        <Text variant="p2semi">Getting quote...</Text>
      </div>
    )
  }

  if (step === 'quote_error') {
    return (
      <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
        <Text variant="p2semi" style={{ color: 'var(--color-semantic-negative-100)' }}>
          {quoteError ?? 'Failed to get quote'}
        </Text>
        <Button variant="primarySmall" onClick={handleStartAgain}>
          Start again
        </Button>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
        <Text variant="p2semi" style={{ color: 'var(--color-semantic-negative-100)' }}>
          {error ?? 'An error occurred'}
        </Text>
        <Button variant="primarySmall" onClick={handleStartAgain}>
          Start again
        </Button>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
        <div className={orderInfoDepositWithdrawStyles.multipleTokensWrapper}>
          <Icon tokenName={fromToken.symbol.toUpperCase() as TokenSymbolsList} size={48} />
          {'->'}
          <Icon tokenName={toToken.symbol.toUpperCase() as TokenSymbolsList} size={48} />
        </div>
        <Text variant="h2">Order Fulfilled!</Text>
        <Text variant="p2semi">
          Your {fromToken.symbol} has been swapped and deposited successfully.
        </Text>
        {orderId && (
          <div className={orderInfoDepositWithdrawStyles.depositDetails}>
            <OrderInformation
              wrapperStyles={{ padding: 'var(--general-space-8)' }}
              items={[
                { label: 'Order ID', value: `${orderId.slice(0, 10)}...` },
                { label: 'Status', value: 'Fulfilled' },
              ]}
            />
          </div>
        )}
        <Button variant="primarySmall" onClick={handleStartAgain}>
          Start again
        </Button>
      </div>
    )
  }

  if (step === 'cancelled' || step === 'expired') {
    return (
      <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
        <Text variant="h2">{step === 'cancelled' ? 'Order Cancelled' : 'Order Expired'}</Text>
        <Text variant="p2semi">
          {step === 'cancelled'
            ? 'Your swap order was cancelled.'
            : 'Your swap order expired before it could be filled.'}
        </Text>
        <Button variant="primarySmall" onClick={handleStartAgain}>
          Start again
        </Button>
      </div>
    )
  }

  if (!quote) return null

  const fromAmountBN = new BigNumber(quote.fromAmount.amount)
  const toAmountBN = new BigNumber(quote.toAmount.amount)
  const exchangeRate = fromAmountBN.isGreaterThan(0)
    ? toAmountBN.div(fromAmountBN).toFixed(6)
    : 'n/a'

  if (step === 'sending') {
    return (
      <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
        <div className={orderInfoDepositWithdrawStyles.multipleTokensWrapper}>
          <Icon tokenName={fromToken.symbol.toUpperCase() as TokenSymbolsList} size={64} />
          {'->'}
          <Icon tokenName={toToken.symbol.toUpperCase() as TokenSymbolsList} size={64} />
        </div>
        <LoadingSpinner />
        <Text variant="p2semi">Submitting order...</Text>
        <div className={orderInfoDepositWithdrawStyles.depositDetails}>
          <OrderInformation
            wrapperStyles={{ padding: 'var(--general-space-8)' }}
            items={[
              {
                label: 'Swap',
                value: `${formatCryptoBalance(quote.fromAmount.amount)} ${fromToken.symbol} → ${formatCryptoBalance(quote.toAmount.amount)} ${toToken.symbol}`,
              },
            ]}
          />
        </div>
      </div>
    )
  }

  if (step === 'polling') {
    return (
      <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
        <div className={orderInfoDepositWithdrawStyles.multipleTokensWrapper}>
          <Icon tokenName={fromToken.symbol.toUpperCase() as TokenSymbolsList} size={64} />
          {'->'}
          <Icon tokenName={toToken.symbol.toUpperCase() as TokenSymbolsList} size={64} />
        </div>
        <Text variant="h2">Order Submitted</Text>
        <Text variant="p2semi">Waiting for order to be filled...</Text>
        <div className={orderInfoDepositWithdrawStyles.depositDetails}>
          <Text variant="p3semi" className={orderInfoDepositWithdrawStyles.depositDetailsTitle}>
            Order Status
          </Text>
          <OrderInformation
            wrapperStyles={{ padding: 'var(--general-space-8)' }}
            items={[
              {
                label: 'Swap',
                value: `${formatCryptoBalance(quote.fromAmount.amount)} ${fromToken.symbol} → ${formatCryptoBalance(quote.toAmount.amount)} ${toToken.symbol}`,
              },
              {
                label: 'Order ID',
                value: orderId ? `${orderId.slice(0, 10)}...` : 'Pending...',
              },
              {
                label: 'Status',
                value: orderStatus ?? 'open',
              },
            ]}
          />
        </div>
        <Button variant="secondarySmall" onClick={handleCancelOrder} disabled={isCancelling}>
          {isCancelling ? 'Cancelling...' : 'Cancel Order'}
        </Button>
      </div>
    )
  }

  // quote step (default)
  return (
    <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
      <div className={orderInfoDepositWithdrawStyles.multipleTokensWrapper}>
        <Icon tokenName={fromToken.symbol.toUpperCase() as TokenSymbolsList} size={64} />
        {'->'}
        <Icon tokenName={toToken.symbol.toUpperCase() as TokenSymbolsList} size={64} />
      </div>
      <Text variant="h2">
        {formatCryptoBalance(quote.fromAmount.amount)}&nbsp;{fromToken.symbol}
      </Text>
      <div className={orderInfoDepositWithdrawStyles.depositDetails}>
        <Text variant="p3semi" className={orderInfoDepositWithdrawStyles.depositDetailsTitle}>
          Swap Quote
        </Text>
        <OrderInformation
          wrapperStyles={{ padding: 'var(--general-space-8)' }}
          items={[
            {
              label: 'Swap',
              value: (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '4px',
                  }}
                >
                  <Icon tokenName={fromToken.symbol.toUpperCase() as TokenSymbolsList} size={20} />
                  {formatCryptoBalance(quote.fromAmount.amount)}&nbsp;{'->'}
                  <Icon tokenName={toToken.symbol.toUpperCase() as TokenSymbolsList} size={20} />
                  {formatCryptoBalance(quote.toAmount.amount)}
                </div>
              ),
            },
            {
              label: 'Price',
              value:
                exchangeRate === 'n/a'
                  ? 'n/a'
                  : `${exchangeRate} ${toToken.symbol}/${fromToken.symbol}`,
            },
            {
              label: 'Quote valid until',
              value: new Date(quote.validTo * 1000).toLocaleTimeString(),
            },
          ]}
        />
      </div>
      <Button
        variant="primarySmall"
        onClick={handleConfirmDeposit}
        disabled={!smartAccountClient?.account}
      >
        Confirm Deposit
      </Button>
    </div>
  )
}
