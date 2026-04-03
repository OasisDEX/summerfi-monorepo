'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Icon, LoadingSpinner, OrderInformation, Text } from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import {
  type AddressValue,
  type IntentQuoteData,
  type IToken,
  TokenAmount,
} from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import Link from 'next/link'
import type { PublicClient } from 'viem'
import { useSignTypedData, useWalletClient } from 'wagmi'

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
  | 'rejected'
  | 'error'
  | 'cancel_error'

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

const getCowExplorerUrl = (chainId: SupportedNetworkIds, id: string): string => {
  const prefixMap: { [key: number]: string | undefined } = {
    1: '', // mainnet has no prefix
    8453: 'base/',
    42161: 'arb1/',
  }
  const prefix = prefixMap[chainId]

  if (prefix === undefined) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }

  return `https://explorer.cow.fi/${prefix}orders/${id}`
}

const truncateMiddle = (str: string, front = 10, back = 6): string => {
  if (str.length <= front + back) return str

  return `${str.slice(0, front)}...${str.slice(-back)}`
}

const LinkText = ({ children }: { children: string }) => (
  <Text
    as="p"
    variant="p3semi"
    style={{
      color: 'var(--color-text-link)',
      textDecoration: 'none',
      cursor: 'pointer',
    }}
  >
    {children}
  </Text>
)

const getExchangeRate = (fromAmount: string, toAmount: string): string => {
  const from = new BigNumber(fromAmount)
  const to = new BigNumber(toAmount)

  return from.isGreaterThan(0) ? to.div(from).toFixed(6) : 'n/a'
}

const TokenPairIcons = ({
  fromToken,
  toToken,
  size,
}: {
  fromToken: IToken
  toToken: IToken
  size: number
}) => (
  <div className={orderInfoDepositWithdrawStyles.multipleTokensWrapper}>
    <Icon tokenName={fromToken.symbol.toUpperCase() as TokenSymbolsList} size={size} />
    {'->'}
    <Icon tokenName={toToken.symbol.toUpperCase() as TokenSymbolsList} size={size} />
  </div>
)

const SwapAmountRow = ({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
}: {
  fromToken: IToken
  toToken: IToken
  fromAmount: string
  toAmount: string
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '4px',
    }}
  >
    <Icon tokenName={fromToken.symbol.toUpperCase() as TokenSymbolsList} size={20} />
    {formatCryptoBalance(fromAmount)}&nbsp;{'->'}
    <Icon tokenName={toToken.symbol.toUpperCase() as TokenSymbolsList} size={20} />
    {formatCryptoBalance(toAmount)}
  </div>
)

const OrderIdLinkValue = ({
  chainId,
  orderId,
}: {
  chainId: SupportedNetworkIds
  orderId: string
}) => (
  <Link href={getCowExplorerUrl(chainId, orderId)} target="_blank" rel="noopener noreferrer">
    <LinkText>{truncateMiddle(orderId)}</LinkText>
  </Link>
)

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
  const {
    getIntentSwapsSellOrderQuote,
    getIntentSwapsSendDepositOrder,
    getIntentSwapsCancelOrder,
    getIntentSwapsCheckOrder,
  } = useAppSDK()

  const { data: walletClient } = useWalletClient()
  const { signTypedDataAsync } = useSignTypedData()

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
        // eslint-disable-next-line no-console
        console.error('Error fetching quote:', err)
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

  const handleRetry = useCallback(() => {
    setStep('quote')
  }, [])

  const handleConfirmDeposit = useCallback(async () => {
    if (!quote || !walletClient) return

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        signTypedData: signTypedDataAsync as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        walletClient: walletClient as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        publicClient: publicClient as any,
        referralCode: (referralCode ?? '0x') as `0x${string}`,
      })

      setOrderId(result.orderId)
      setOrderStatus('open')
      setStep('polling')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error sending deposit order:', err)
      const isRejected = err instanceof Error && /rejected|denied/iu.test(err.message)

      if (isRejected) {
        setStep('rejected')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to send deposit order')
        setStep('error')
      }
    }
  }, [
    quote,
    chainId,
    fleetAddressValue,
    userWalletAddress,
    publicClient,
    walletClient,
    referralCode,
    getIntentSwapsSendDepositOrder,
    signTypedDataAsync,
  ])

  const handleCancelOrder = useCallback(async () => {
    if (!orderId || isCancelling) return

    setIsCancelling(true)
    try {
      await getIntentSwapsCancelOrder({
        chainId,
        orderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        walletClient: walletClient as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        publicClient: publicClient as any,
      })
      clearInterval(pollingIntervalRef.current)
      setStep('cancelled')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error cancelling order:', err)
      setError(err instanceof Error ? err.message : 'Failed to cancel order')
      setStep('cancel_error')
    } finally {
      setIsCancelling(false)
    }
  }, [orderId, chainId, publicClient, getIntentSwapsCancelOrder, isCancelling, walletClient])

  if (step === 'loading_quote') {
    return (
      <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
        <LoadingSpinner />
        <Text variant="p2semi">Getting quote...</Text>
      </div>
    )
  }

  if (step === 'cancel_error') {
    return (
      <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
        <Text variant="p2semi" style={{ color: 'var(--color-semantic-negative-100)' }}>
          {error ?? 'Failed to cancel order'}
        </Text>
        {orderId && (
          <div className={orderInfoDepositWithdrawStyles.depositDetails}>
            <OrderInformation
              wrapperStyles={{ padding: 'var(--general-space-8)' }}
              items={[
                {
                  label: 'Order ID',
                  value: <OrderIdLinkValue chainId={chainId} orderId={orderId} />,
                },
                { label: 'Status', value: 'Open' },
              ]}
            />
          </div>
        )}
        <div style={{ width: '100%', marginTop: 'var(--general-space-20)' }} />
        <Button variant="primaryLarge" onClick={handleCancelOrder} disabled={isCancelling}>
          {isCancelling ? 'Cancelling...' : 'Try again'}
        </Button>
        <Button variant="secondarySmall" onClick={handleStartAgain}>
          Start again
        </Button>
      </div>
    )
  }

  if (step === 'quote_error' || step === 'error') {
    const message =
      step === 'quote_error'
        ? (quoteError ?? 'Failed to get quote')
        : (error ?? 'An error occurred')

    return (
      <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
        <Text variant="p2semi" style={{ color: 'var(--color-semantic-negative-100)' }}>
          {message}
        </Text>
        <div style={{ width: '100%', marginTop: 'var(--general-space-20)' }} />
        <Button variant="primaryLarge" onClick={handleStartAgain}>
          Start again
        </Button>
      </div>
    )
  }

  if (step === 'success') {
    const _exchangeRate = quote
      ? getExchangeRate(quote.fromAmount.amount, quote.toAmount.amount)
      : 'n/a'

    return (
      <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
        <TokenPairIcons fromToken={fromToken} toToken={toToken} size={48} />
        <Text variant="h2">Order fulfilled!</Text>
        <Text variant="p2semi">
          Your {fromToken.symbol} has been swapped and deposited successfully.
        </Text>
        {quote && (
          <div className={orderInfoDepositWithdrawStyles.depositDetails}>
            <OrderInformation
              wrapperStyles={{ padding: 'var(--general-space-8)' }}
              items={[
                {
                  label: 'Swap',
                  value: (
                    <SwapAmountRow
                      fromToken={fromToken}
                      toToken={toToken}
                      fromAmount={quote.fromAmount.amount}
                      toAmount={quote.toAmount.amount}
                    />
                  ),
                },
                {
                  label: 'Price',
                  value:
                    _exchangeRate === 'n/a'
                      ? 'n/a'
                      : `${_exchangeRate} ${toToken.symbol}/${fromToken.symbol}`,
                },
                ...(orderId
                  ? [
                      {
                        label: 'Order ID',
                        value: <OrderIdLinkValue chainId={chainId} orderId={orderId} />,
                      },
                    ]
                  : []),
                { label: 'Status', value: 'Fulfilled' },
              ]}
            />
          </div>
        )}
        <div style={{ width: '100%', marginTop: 'var(--general-space-20)' }} />
        <Button variant="primaryLarge" onClick={handleStartAgain}>
          Start again
        </Button>
      </div>
    )
  }

  if (step === 'rejected') {
    return (
      <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
        <Text variant="p2semi" style={{ color: 'var(--color-semantic-negative-100)' }}>
          Transaction rejected. Please try again.
        </Text>
        <div style={{ width: '100%', marginTop: 'var(--general-space-20)' }} />
        <Button variant="primaryLarge" onClick={handleRetry}>
          Try again
        </Button>
        <Button variant="secondarySmall" onClick={handleStartAgain}>
          Start again
        </Button>
      </div>
    )
  }

  if (step === 'cancelled' || step === 'expired') {
    return (
      <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
        <Text variant="h2">{step === 'cancelled' ? 'Order cancelled' : 'Order expired'}</Text>
        <Text variant="p2semi">
          {step === 'cancelled'
            ? 'Your swap order was cancelled.'
            : 'Your swap order expired before it could be filled.'}
        </Text>
        {orderId && (
          <div className={orderInfoDepositWithdrawStyles.depositDetails}>
            <OrderInformation
              wrapperStyles={{ padding: 'var(--general-space-8)' }}
              items={[
                {
                  label: 'Order ID',
                  value: <OrderIdLinkValue chainId={chainId} orderId={orderId} />,
                },
                { label: 'Status', value: step === 'cancelled' ? 'Cancelled' : 'Expired' },
              ]}
            />
          </div>
        )}
        <div style={{ width: '100%', marginTop: 'var(--general-space-20)' }} />
        <Button variant="primaryLarge" onClick={handleStartAgain}>
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
        <TokenPairIcons fromToken={fromToken} toToken={toToken} size={64} />
        <LoadingSpinner />
        <Text variant="p2semi">Confirm and sign...</Text>
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
        <TokenPairIcons fromToken={fromToken} toToken={toToken} size={64} />
        <Text variant="h2">Order submitted</Text>
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
                value: orderId ? (
                  <OrderIdLinkValue chainId={chainId} orderId={orderId} />
                ) : (
                  'Pending...'
                ),
              },
              {
                label: 'Status',
                value: orderStatus === 'open' ? 'Pending' : orderStatus,
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
                <SwapAmountRow
                  fromToken={fromToken}
                  toToken={toToken}
                  fromAmount={quote.fromAmount.amount}
                  toAmount={quote.toAmount.amount}
                />
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
              value: new Date(quote.validTo * 1000).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          ]}
        />
      </div>
      <div
        style={{
          width: '100%',
          marginTop: 'var(--general-space-20)',
        }}
      >
        {' '}
      </div>
      <Button variant="primaryLarge" onClick={handleConfirmDeposit} disabled={!walletClient}>
        Confirm and Sign
      </Button>
    </div>
  )
}
