'use client'
import { useEffect, useState } from 'react'
import { useChain, useSendUserOperation, useSmartAccountClient, useUser } from '@account-kit/react'
import { Button, Card, Input, Text } from '@summerfi/app-ui'
import type { IArmadaPosition, Token, TransactionInfo } from '@summerfi/sdk-client-react'
import { type WagmiConfig } from '@web3-onboard/core'
import { useAppState } from '@web3-onboard/react'
import { getBalance } from '@web3-onboard/wagmi'
import dynamic from 'next/dynamic'

import { accountType } from '@/account-kit/config'
import { prepareTransaction } from '@/helpers/sdk/prepare-transaction'
import type { FleetConfig } from '@/helpers/sdk/types'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useDepositTX } from '@/hooks/use-deposit'
import { useWithdrawTX } from '@/hooks/use-withdraw'

enum Action {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

const SetForkModal = dynamic(() => import('@/components/organisms/SetFork/SetForkModal'), {
  ssr: false,
})

export type FormProps = { fleetConfig: FleetConfig }

const Form = ({ fleetConfig: { tokenSymbol, fleetAddress } }: FormProps) => {
  const [action, setAction] = useState(Action.DEPOSIT)
  const [amountValue, setAmountValue] = useState<string>()
  const [transactionsHash, setTransactionsHash] = useState<string[]>([])
  const [transactionError, setTransactionError] = useState<string>()
  const [token, setToken] = useState<Token>()
  const [tokenBalance, setTokenBalance] = useState<number>()
  const [userPosition, setUserPosition] = useState<IArmadaPosition>()

  const balance = action === Action.DEPOSIT ? tokenBalance : userPosition?.amount.amount
  const balanceLabel = action === Action.DEPOSIT ? 'Wallet' : 'Fleet'

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

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setAmountValue(ev.target.value)
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

  return (
    <Card style={{ width: '468px', flexDirection: 'column', alignItems: 'center' }}>
      <Text
        as="p"
        variant="p1semi"
        style={{
          textAlign: 'left',
          width: '100%',
          marginBottom: '24px',
          paddingBottom: '15px',
          borderBottom: '1px solid rgb(240, 240, 240)',
        }}
        title={fleetAddress}
      >
        Manage your {tokenSymbol} Fleet
      </Text>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <Button
          variant={action === Action.DEPOSIT ? 'primarySmall' : 'secondarySmall'}
          onClick={() => setAction(Action.DEPOSIT)}
        >
          Deposit
        </Button>
        <Button
          variant={action === Action.WITHDRAW ? 'primarySmall' : 'secondarySmall'}
          onClick={() => setAction(Action.WITHDRAW)}
        >
          Withdraw
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '16px',
        }}
      >
        <Text as="p" variant="p3semi">
          {action === Action.DEPOSIT ? 'Deposit' : 'Withdraw'}
        </Text>
        {balance != null && (
          <Text
            as="p"
            variant="p3semi"
            style={{ cursor: 'pointer' }}
            onClick={() => setAmountValue(balance.toString())}
          >
            {balanceLabel} Balance: {Number(balance).toFixed(3)} {tokenSymbol}
          </Text>
        )}
      </div>

      <Input
        type="number"
        value={amountValue}
        wrapperStyles={{ width: '100%', marginBottom: '24px' }}
        style={{ width: '100%' }}
        onChange={handleChange}
      />
      <Button
        variant="primaryLarge"
        onClick={handleConfirm}
        style={{ width: '100%' }}
        disabled={confirmDisabled}
      >
        Confirm
      </Button>
      {!!transactionsHash.length && <Text as="p">Transactions sent: {transactionsHash}</Text>}
      {transactionError && <Text as="p">Transaction error: {transactionError}</Text>}

      <SetForkModal />
    </Card>
  )
}

export default Form
