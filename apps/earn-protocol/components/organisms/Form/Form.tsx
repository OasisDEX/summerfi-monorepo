'use client'
import { type ChangeEvent, useEffect, useState } from 'react'
import { useChain, useSendUserOperation, useSmartAccountClient, useUser } from '@account-kit/react'
import { Sidebar, SidebarFootnote, sidebarFootnote } from '@summerfi/app-earn-ui'
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

enum Action {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export type FormProps = { fleetConfig: FleetConfig }

const Form = ({ fleetConfig: { tokenSymbol, fleetAddress } }: FormProps) => {
  const [action, setAction] = useState(Action.DEPOSIT)
  const [amountValue, setAmountValue] = useState<string>()
  const [transactionHash, setTransactionHash] = useState<string[]>([])
  const [transactionError, setTransactionError] = useState<string>()
  const [token, setToken] = useState<Token>()
  const [tokenBalance, setTokenBalance] = useState<number>()
  const [userPosition, setUserPosition] = useState<IArmadaPosition>()

  const _fixUnused = {
    // quick fix to avoid eslint warning
    transactionHash,
    transactionError,
    tokenBalance,
    userPosition,
    setAction,
  }

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
      setTransactionHash((prev) => [...prev, hash])
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
    footnote: (
      <SidebarFootnote
        title={sidebarFootnote.title}
        list={sidebarFootnote.list}
        tooltip={sidebarFootnote.tooltip}
      />
    ),
  }

  return <Sidebar {...sidebarProps} />
}

export default Form
