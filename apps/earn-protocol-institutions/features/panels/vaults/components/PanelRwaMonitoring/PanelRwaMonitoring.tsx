'use client'

import { type FC, useEffect, useMemo, useState } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'
import { networkNameToSDKId } from '@summerfi/app-utils'
import { RoundState, RoundsVaultType } from '@summerfi/sdk-common'

import { useAdminAppSDK } from '@/hooks/useAdminAppSDK'

interface PanelRwaMonitoringProps {
  institutionName: string
  vaultAddress: string
  network: NetworkNames
  curatorName?: string
  curatorDescription?: string
  factSheetUrl?: string
}

const roundStateLabel: { [key in RoundState]: string } = {
  [RoundState.NotOpened]: 'Not opened',
  [RoundState.Opened]: 'Open',
  [RoundState.InSettlement]: 'In settlement',
  [RoundState.Settled]: 'Settled',
}

type MarketValue = {
  total: string
  totalUsd: string
  fleetAssets: string
  pendingDeposits: string
  claimableWithdrawals: string
  symbol: string
}

type RoundInfo = { round: string; state: string }

const StatRow: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '6px 0' }}>
    <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
      {label}
    </Text>
    <Text variant="p3semi">{value}</Text>
  </div>
)

export const PanelRwaMonitoring: FC<PanelRwaMonitoringProps> = ({
  institutionName,
  vaultAddress,
  network,
  curatorName,
  curatorDescription,
  factSheetUrl,
}) => {
  const chainId = networkNameToSDKId(network)
  const fleetAddress = vaultAddress.toLowerCase() as `0x${string}`
  const { getRwaVaultMarketValue, getRwaCurrentRound, getRwaRoundState } =
    useAdminAppSDK(institutionName)

  const [marketValue, setMarketValue] = useState<MarketValue | null>(null)
  const [inputRound, setInputRound] = useState<RoundInfo | null>(null)
  const [outputRound, setOutputRound] = useState<RoundInfo | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    const readRound = async (vaultType: RoundsVaultType): Promise<RoundInfo> => {
      const round = await getRwaCurrentRound({ fleetAddress, chainId, vaultType })
      const state = await getRwaRoundState({ fleetAddress, chainId, roundId: round, vaultType })

      return { round: round.toString(), state: roundStateLabel[state] }
    }

    Promise.all([
      getRwaVaultMarketValue({ fleetAddress, chainId }),
      readRound(RoundsVaultType.Input),
      readRound(RoundsVaultType.Output),
    ])
      .then(([mv, input, output]) => {
        if (cancelled) return
        setMarketValue({
          total: mv.total.amount,
          totalUsd: mv.totalUsd.amount,
          fleetAssets: mv.fleetAssets.amount,
          pendingDeposits: mv.pendingDeposits.amount,
          claimableWithdrawals: mv.claimableWithdrawals.amount,
          symbol: mv.total.token.symbol,
        })
        setInputRound(input)
        setOutputRound(output)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })

    return () => {
      cancelled = true
    }
  }, [getRwaVaultMarketValue, getRwaCurrentRound, getRwaRoundState, fleetAddress, chainId])

  const curatorBlock = useMemo(() => {
    if (!curatorName && !curatorDescription && !factSheetUrl) return null

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Curator
        </Text>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {curatorName ? <Text variant="p2semi">{curatorName}</Text> : null}
            {curatorDescription ? (
              <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
                {curatorDescription}
              </Text>
            ) : null}
            {factSheetUrl ? (
              <a href={factSheetUrl} target="_blank" rel="noopener noreferrer">
                <Text variant="p3" style={{ color: 'var(--color-text-link)' }}>
                  View fact sheet
                </Text>
              </a>
            ) : null}
          </div>
        </Card>
      </div>
    )
  }, [curatorName, curatorDescription, factSheetUrl])

  return (
    <Card variant="cardSecondary" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {curatorBlock}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Market value (true TVL)
        </Text>
        <Card>
          {error ? (
            <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
              Unable to load market value.
            </Text>
          ) : !marketValue ? (
            <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
              Loading…
            </Text>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <StatRow label="Total" value={`${marketValue.total} ${marketValue.symbol}`} />
              <StatRow label="Total (USD)" value={`$${marketValue.totalUsd}`} />
              <StatRow
                label="Fleet assets"
                value={`${marketValue.fleetAssets} ${marketValue.symbol}`}
              />
              <StatRow
                label="Pending deposits"
                value={`${marketValue.pendingDeposits} ${marketValue.symbol}`}
              />
              <StatRow
                label="Claimable withdrawals"
                value={`${marketValue.claimableWithdrawals} ${marketValue.symbol}`}
              />
            </div>
          )}
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Rounds
        </Text>
        <Card>
          {error ? (
            <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
              Unable to load round state.
            </Text>
          ) : !inputRound || !outputRound ? (
            <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
              Loading…
            </Text>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <StatRow
                label="Deposit (input) round"
                value={`#${inputRound.round} · ${inputRound.state}`}
              />
              <StatRow
                label="Withdraw (output) round"
                value={`#${outputRound.round} · ${outputRound.state}`}
              />
            </div>
          )}
        </Card>
      </div>
    </Card>
  )
}
