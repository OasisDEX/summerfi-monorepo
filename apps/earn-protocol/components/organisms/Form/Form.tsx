'use client'
import { useEffect, useState } from 'react'
import { Button, Card, Input, Text } from '@summerfi/app-ui'
import type { Token, TransactionInfo } from '@summerfi/sdk-common'
import { useAppState, useConnectWallet } from '@web3-onboard/react'
import { type Config as WagmiConfig, getBalance, sendTransaction } from '@web3-onboard/wagmi'
import dynamic from 'next/dynamic'

import { prepareTransaction } from '@/helpers/sdk/prepare-transaction'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useDepositTX } from '@/hooks/use-deposit'
import { useWithdrawTX } from '@/hooks/use-withdraw'

enum Action {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

// TODO: Replace with the real dynamic values from the UI controls state
const tokenSymbol = 'USDC'
const usdcFleetAddress = '0x75d4f7cb1b2481385e0878c639f6f6d66592d399'

const SetForkModal = dynamic(() => import('@/components/organisms/SetFork/SetForkModal'), {
  ssr: false,
})

const Form = () => {
  const [action, setAction] = useState(Action.DEPOSIT)
  const [amountValue, setAmountValue] = useState<string>()
  const [transactionsHash, setTransactionsHash] = useState<string>()
  const [transactionError, setTransactionError] = useState<string>()
  const [token, setToken] = useState<Token>()
  const [tokenBalance, setTokenBalance] = useState<number>()
  const [depositBalance, setDepositBalance] = useState<number>()

  const balance = action === Action.DEPOSIT ? tokenBalance : depositBalance
  const balanceLabel = action === Action.DEPOSIT ? 'Wallet' : 'Fleet'

  const [isPendingTransaction, setIsPendingTransaction] = useState<boolean>(false)
  const [{ wallet }] = useConnectWallet()
  const { wagmiConfig } = useAppState()
  const { getTokenBySymbol } = useAppSDK()
  const deposit = useDepositTX()
  const withdraw = useWithdrawTX()

  const confirmDisabled = !amountValue || isPendingTransaction
  const chainId = wallet?.chains[0].id ? Number(wallet.chains[0].id) : undefined
  const walletAddress = wallet?.accounts[0].address

  async function sendSDKTransaction(transaction: TransactionInfo) {
    return await sendTransaction(wagmiConfig as WagmiConfig, {
      connector: wallet?.wagmiConnector,
      ...prepareTransaction(transaction),
    }).then((res) => {
      return res
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
  }, [chainId, getTokenBySymbol])

  useEffect(() => {
    async function fetchTokenBalance() {
      if (chainId && walletAddress && token) {
        const { value, decimals } = await getBalance(wagmiConfig as WagmiConfig, {
          chainId,
          address: walletAddress,
          token: token.address.value,
        })

        setTokenBalance(Number(value / BigInt(10 ** decimals)))
      }
    }
    fetchTokenBalance()
  }, [chainId, walletAddress, token?.symbol, token, wagmiConfig])

  useEffect(() => {
    async function fetchDepositBalance() {
      if (chainId && walletAddress && token) {
        setDepositBalance(0)
      }
    }
    fetchDepositBalance()
  }, [chainId, walletAddress, token?.symbol, token, wagmiConfig])

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setAmountValue(ev.target.value)
  }

  const getDepositTransaction = () => {
    if (!amountValue || !chainId || !walletAddress || !token) {
      return undefined
    }

    return deposit({
      chainId,
      walletAddress,
      fleetAddress: usdcFleetAddress,
      amountString: amountValue.toString(),
    })
  }

  const getWithdrawTransaction = () => {
    if (!amountValue || !chainId || !walletAddress || !token) {
      return undefined
    }

    return withdraw({
      chainId,
      walletAddress,
      fleetAddress: usdcFleetAddress,
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
        const transactionHashes: string[] = []

        setTransactionsHash(undefined)
        setTransactionError(undefined)
        setIsPendingTransaction(true)

        for (const [_, transaction] of transactions.entries()) {
          const txHash = await sendSDKTransaction(transaction)

          transactionHashes.push(txHash)
        }
        setTransactionsHash(transactionHashes.join(', '))
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
        title={usdcFleetAddress}
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
      {transactionsHash && <Text as="p">Transactions sent: {transactionsHash}</Text>}
      {transactionError && <Text as="p">Transaction error: {transactionError}</Text>}

      <SetForkModal />
    </Card>
  )
}

export default Form
