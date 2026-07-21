'use client'

import { useEffect, useState } from 'react'
import { Button, Text } from '@summerfi/app-earn-ui'
import { formatAddress } from '@summerfi/app-utils'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export const ConnectButton = () => {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  // Hydration guard: server-rendered HTML never knows the wallet state.
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="secondarySmall" disabled>
        Connect wallet
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <Button variant="secondarySmall" onClick={() => disconnect()}>
        <Text as="span" variant="p3semi">
          {formatAddress(address, { first: 6 })}
        </Text>
      </Button>
    )
  }

  return (
    <Button
      variant="primarySmall"
      disabled={isPending}
      onClick={() => {
        const injectedConnector =
          connectors.find((connector) => connector.type === 'injected') ?? connectors[0]

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (injectedConnector) connect({ connector: injectedConnector })
      }}
    >
      {isPending ? 'Connecting…' : 'Connect wallet'}
    </Button>
  )
}
