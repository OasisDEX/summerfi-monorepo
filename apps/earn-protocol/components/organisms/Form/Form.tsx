'use client'
import React, { type ChangeEvent, useEffect, useState } from 'react'
import { useChain, useSendUserOperation, useSmartAccountClient, useUser } from '@account-kit/react'
import { Icon, Sidebar, Text } from '@summerfi/app-earn-ui'
import { type DropdownOption } from '@summerfi/app-types'
import { mapNumericInput } from '@summerfi/app-utils'
import type { IArmadaPosition, Token, TransactionInfo } from '@summerfi/sdk-client-react'
import { type WagmiConfig } from '@web3-onboard/core'
import { useAppState } from '@web3-onboard/react'
import { getBalance } from '@web3-onboard/wagmi'
import { capitalize } from 'lodash'

import { accountType } from '@/account-kit/config'
import { prepareTransaction } from '@/helpers/sdk/prepare-transaction'
import type { FleetConfig } from '@/helpers/sdk/types'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useDepositTX } from '@/hooks/use-deposit'
import { useWithdrawTX } from '@/hooks/use-withdraw'

const options: DropdownOption[] = [
  { label: 'DAI', value: 'DAI', tokenSymbol: 'DAI' },
  { label: 'USDC', value: 'USDC', tokenSymbol: 'USDC' },
  { label: 'USDT', value: 'USDT', tokenSymbol: 'USDT' },
]

const tooltip = {
  title: 'Key details about your assets',
  list: [
    'No minimum required',
    'Earning paid in same currency as currency deposited',
    'Deposit any asset from your wallet into a strategy',
    'Assets will be automatically converted to the base token used in that strategy.',
    <>
      <Text as="span" variant="p3semi" style={{ color: 'var(--color-text-primary)' }}>
        No single point of failure.
      </Text>{' '}
      No single point can cause system failure, ensuring security and reliability.
    </>,
  ],
  style: {
    maxWidth: '504px',
    width: '504px',
    left: '-150px',
  },
}

enum Action {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export type FormProps = { fleetConfig: FleetConfig }

const Form = ({ fleetConfig: { tokenSymbol, fleetAddress } }: FormProps) => {
  const [action, setAction] = useState(Action.DEPOSIT)
  const [amountValue, setAmountValue] = useState<string>()
  const [, setTransactionsHash] = useState<string[]>([])
  const [, setTransactionError] = useState<string>()
  const [token, setToken] = useState<Token>()
  const [, setTokenBalance] = useState<number>()
  const [, setUserPosition] = useState<IArmadaPosition>()

  // const balance = action === Action.DEPOSIT ? tokenBalance : userPosition?.amount.amount
  // const balanceLabel = action === Action.DEPOSIT ? 'Wallet' : 'Fleet'

  const [isPendingTransaction, setIsPendingTransaction] = useState<boolean>(false)
  const user = useUser()
  const chain = useChain()

  const { client } = useSmartAccountClient({
    type: accountType,
  })
  const { sendUserOperation } = useSendUserOperation({
    client,
    onSuccess: ({ hash }) => {
      // eslint-disable-next-line no-console
      console.log('hash', hash)
      setTransactionsHash((prev) => [...prev, hash])
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log('txError', error)
      setTransactionError(error.message.toString())
    },
  })

  const { getTokenBySymbol, getUserPosition, getCurrentUser } = useAppSDK()
  const deposit = useDepositTX()
  const withdraw = useWithdrawTX()

  const confirmDisabled = !amountValue || isPendingTransaction
  const chainId = chain.chain.id
  const walletAddress = user?.address
  const { wagmiConfig } = useAppState()

  async function sendSDKTransaction(transaction: TransactionInfo) {
    return sendUserOperation({
      uo: {
        ...prepareTransaction(transaction),
      },
    })
  }

  useEffect(() => {
    async function fetchToken() {
      if (chainId) {
        const _token = await getTokenBySymbol({ chainId, symbol: tokenSymbol })

        setToken(_token)
      }
    }
    fetchToken()
  }, [chainId, tokenSymbol, getTokenBySymbol])

  useEffect(() => {
    async function fetchTokenBalance() {
      if (chainId && walletAddress && token != null) {
        const { value, decimals } = await getBalance(wagmiConfig as WagmiConfig, {
          chainId,
          address: walletAddress,
          token: token.address.value,
        })

        setTokenBalance(Number(value / BigInt(10 ** decimals)))
      }
    }
    fetchTokenBalance()
  }, [chainId, walletAddress, token?.symbol, token])

  useEffect(() => {
    async function fetchDepositBalance() {
      const position = await getUserPosition({
        fleetAddress,
        user: getCurrentUser(),
      })

      setUserPosition(position)
    }
    fetchDepositBalance()
  }, [fleetAddress, getCurrentUser, getUserPosition])

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setAmountValue(mapNumericInput(ev.target.value))
  }

  const getDepositTransaction = () => {
    if (!amountValue || !chainId || !walletAddress || !token) {
      return undefined
    }

    return deposit({
      fleetAddress,
      amountString: amountValue.toString(),
    })
  }

  const getWithdrawTransaction = () => {
    if (!amountValue || !chainId || !walletAddress || !token) {
      return undefined
    }

    return withdraw({
      fleetAddress,
      amountString: amountValue.toString(),
    })
  }

  const handleConfirm = async () => {
    let transactions: TransactionInfo[] | undefined

    switch (action) {
      case Action.DEPOSIT:
        transactions = await getDepositTransaction()

        break
      case Action.WITHDRAW:
        transactions = await getWithdrawTransaction()

        break
      default:
        throw new Error('Invalid action')
    }

    if (transactions) {
      try {
        setTransactionError(undefined)
        setIsPendingTransaction(true)

        for (const [_, transaction] of transactions.entries()) {
          await sendSDKTransaction(transaction)
        }
      } catch (error) {
        setTransactionError('An error occurred while sending the transaction (check the console)')
        setIsPendingTransaction(false)

        throw error
      }
      setIsPendingTransaction(false)
    }
  }

  const dropdownValue = options.find((option) => option.value === 'USDC') || options[0]

  const sidebarProps = {
    title: capitalize(action),
    inputValue: amountValue || '',
    dropdown: { value: dropdownValue, options },
    handleInputChange: handleChange,
    banner: {
      title: 'Estimated earnings after 1 year',
      value: '67,353 USDC',
    },
    primaryButton: {
      label: 'Get Started',
      action: handleConfirm,
      disabled: confirmDisabled,
    },
    footnote: {
      title: tooltip.title,
      tooltip: (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text as="p" variant="p2semi" style={{ marginBottom: 'var(--spacing-space-medium)' }}>
            {tooltip.title}
          </Text>
          <ul>
            {tooltip.list.map((item, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 'var(--spacing-space-small)',
                  marginBottom: 'var(--spacing-space-small)',
                }}
              >
                <Icon iconName="checkmark" size={14} color="rgba(255, 73, 164, 1)" />
                <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                  {item}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      ),
      tooltipStyle: tooltip.style,
    },
  }

  return <Sidebar {...sidebarProps} />
}

export default Form
