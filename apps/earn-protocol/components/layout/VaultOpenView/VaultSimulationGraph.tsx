'use client'

import { useEffect, useState } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

import { MockedLineChart } from '@/components/organisms/Charts/MockedLineChart'

export const VaultSimulationGraph = ({
  amount,
  vault,
}: {
  amount?: BigNumber
  vault: SDKVaultishType
}) => {
  const [amountCached, setAmountCached] = useState<BigNumber>()

  useEffect(() => {
    if (!amount || amount.eq(0)) {
      return
    }
    setAmountCached(amount)
  }, [amount, amountCached])

  return (
    <Card
      style={{
        flexDirection: 'column',
        marginBottom: 'var(--general-space-16)',
        textAlign: 'center',
      }}
    >
      <Text
        variant="p1semi"
        style={{
          marginTop: 'var(--general-space-8)',
          marginBottom: 'var(--general-space-8)',
          color: 'var(--color-text-primary-disabled)',
        }}
      >
        You could earn
      </Text>
      <Text
        variant="h2"
        style={{
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--general-space-8)',
        }}
      >
        {amountCached &&
          `$${formatCryptoBalance(amountCached.plus(amountCached.times(vault.calculatedApr).div(100)))}`}
      </Text>
      <Text
        variant="p2semi"
        style={{
          color: 'var(--color-text-secondary)',
        }}
      >
        {amountCached && `${formatCryptoBalance(amountCached)} ${vault.inputToken.symbol}`}
      </Text>
      <MockedLineChart />
    </Card>
  )
}
