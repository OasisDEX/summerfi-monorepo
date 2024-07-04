'use client'
import { useState } from 'react'
import { Button, Card, Input, Text } from '@summerfi/app-ui'
import { useAppState, useConnectWallet } from '@web3-onboard/react'
import { signMessage } from '@web3-onboard/wagmi'

enum Action {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export const Form = () => {
  const [action, setAction] = useState(Action.DEPOSIT)
  const [value, setValue] = useState<number>()
  const [{ wallet }] = useConnectWallet()
  const { wagmiConfig } = useAppState()

  async function signTestMessage() {
    // current primary wallet - as multiple wallets can connect this value is the currently active
    await signMessage(wagmiConfig, {
      message: 'This is my message to you',
      connector: wallet?.wagmiConnector,
    }).then((res) => {
      console.log(res)
    })
  }

  // @ts-ignore
  const ethBalance = wallet?.accounts[0]?.balance?.ETH

  const handleChange = (event: any) => {
    setValue(event.target.value)
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
        {ethBalance && (
          <Text
            as="p"
            variant="p3semi"
            style={{ cursor: 'pointer' }}
            onClick={() => setValue(Number(ethBalance))}
          >
            Balance: {Number(ethBalance).toFixed(3)} ETH
          </Text>
        )}
      </div>

      <Input
        type="number"
        value={value}
        style={{ width: '100%', marginBottom: '24px' }}
        onChange={handleChange}
      />
      <Button
        variant="primaryLarge"
        onClick={() => null}
        style={{ width: '100%' }}
        disabled={!value}
      >
        Confirm
      </Button>
      <Button variant="primaryLarge" style={{ width: '100%' }} onClick={signTestMessage}>
        Sign test message
      </Button>
    </Card>
  )
}
