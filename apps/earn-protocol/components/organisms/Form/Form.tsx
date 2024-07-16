'use client'
import { useState } from 'react'
import { Button, Card, Input, Text } from '@summerfi/app-ui'
import type { TransactionInfo } from '@summerfi/sdk-common'
import { useAppState, useConnectWallet } from '@web3-onboard/react'
import { type Config as WagmiConfig, sendTransaction, signMessage } from '@web3-onboard/wagmi'
import { useDeposit, useWithdraw } from 'providers/SDK'

enum Action {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

// TODO: Replace with the real dynamic values from the UI state
const tokenSymbol = 'USDC'
const usdcFleetAddress = '0xa09e82322f351154a155f9e0f9e6ddbc8791c794'

export const Form = () => {
  const [action, setAction] = useState(Action.DEPOSIT)
  const [value, setValue] = useState<number>()
  const [{ wallet }] = useConnectWallet()
  const { wagmiConfig } = useAppState()

  const deposit = useDeposit()
  const withdraw = useWithdraw()

  async function signTestMessage() {
    // current primary wallet - as multiple wallets can connect this value is the currently active
    await signMessage(wagmiConfig as WagmiConfig, {
      message: 'This is my message to you',
      connector: wallet?.wagmiConnector,
    }).then((res) => {
      // eslint-disable-next-line no-console
      console.log(res)
    })
  }

  async function sendSDKTransaction(transaction: TransactionInfo) {
    // current primary wallet
    await sendTransaction(wagmiConfig as WagmiConfig, {
      // TODO: add params
    }).then((res) => {
      // eslint-disable-next-line no-console
      console.log(res)
    })
  }

  // @ts-ignore
  const usdcBalance = wallet?.accounts[0]?.balance?.[tokenSymbol]

  const handleChange = (event: any) => {
    setValue(event.target.value)
  }

  const getDepositTransaction = () => {
    if (!value) {
      return undefined
    }

    return deposit({
      chainId: wallet?.chains[0]?.id,
      walletAddress: wallet?.accounts[0]?.address,
      fleetAddress: usdcFleetAddress,
      amountString: value.toString(),
      tokenSymbol,
    })
  }

  const getWithdrawTransaction = () => {
    if (!value) {
      return undefined
    }

    return withdraw({
      chainId: wallet?.chains[0]?.id,
      walletAddress: wallet?.accounts[0]?.address,
      fleetAddress: usdcFleetAddress,
      amountString: value.toString(),
      tokenSymbol,
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
      for (const [_, transaction] of transactions.entries()) {
        const receipt = await sendSDKTransaction(transaction)

        // eslint-disable-next-line no-console
        console.log('Transaction sent:', receipt)
      }
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
      >
        Manage your Summer Earn position
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
        {usdcBalance && (
          <Text
            as="p"
            variant="p3semi"
            style={{ cursor: 'pointer' }}
            onClick={() => setValue(Number(usdcBalance))}
          >
            Balance: {Number(usdcBalance).toFixed(3)} ETH
          </Text>
        )}
      </div>

      <Input
        type="number"
        value={value}
        wrapperStyles={{ width: '100%', marginBottom: '24px' }}
        style={{ width: '100%' }}
        onChange={handleChange}
      />
      <Button
        variant="primaryLarge"
        onClick={handleConfirm}
        style={{ width: '100%' }}
        disabled={!value}
      >
        Confirm
      </Button>
      <Button
        variant="secondarySmall"
        style={{ width: '100%', marginTop: '15px' }}
        onClick={signTestMessage}
      >
        Sign test message
      </Button>
    </Card>
  )
}
