import { Card, Text } from '@summerfi/app-earn-ui'
import { type IPrice, RoundState } from '@summerfi/sdk-common'

type RwaRoundNoticeProps = {
  roundId?: bigint
  roundState?: RoundState
  exchangeRate?: IPrice
  isLoading: boolean
}

// Short human label per round state.
const roundStateLabel: { [key in RoundState]: string } = {
  [RoundState.NotOpened]: 'Not open yet',
  [RoundState.Opened]: 'Open',
  [RoundState.InSettlement]: 'Settling',
  [RoundState.Settled]: 'Settled',
}

/**
 * Compact notice shown in the RWA deposit sidebar that explains the rounds-based
 * deposit flow: which round a deposit enters, the round's current state, and
 * (once available) the round exchange rate. Mirrors the simple Card/Text style
 * used across the app.
 */
export const RwaRoundNotice = ({
  roundId,
  roundState,
  exchangeRate,
  isLoading,
}: RwaRoundNoticeProps) => {
  const isOpen = roundState === RoundState.Opened
  const roundLabel = roundId !== undefined ? `#${roundId.toString()}` : ''

  const description =
    roundState === undefined
      ? 'Deposits enter the current round and become claimable once the round settles.'
      : isOpen
        ? `Deposits enter round ${roundLabel} and become claimable once the round settles.`
        : `Round ${roundLabel} is not currently accepting deposits. Please check back once the next round opens.`

  return (
    <Card
      variant="cardSecondary"
      style={{ flexDirection: 'column', gap: 'var(--general-space-8)', marginTop: '16px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text as="p" variant="p3semi">
          Deposit round {roundLabel}
        </Text>
        {roundState !== undefined ? (
          <Text
            as="span"
            variant="p3semi"
            style={{
              color: isOpen
                ? 'var(--earn-protocol-success-100)'
                : 'var(--earn-protocol-secondary-60)',
            }}
          >
            {isLoading ? 'Loading…' : roundStateLabel[roundState]}
          </Text>
        ) : null}
      </div>

      <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
        {description}
      </Text>

      {exchangeRate ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text as="span" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
            Exchange rate
          </Text>
          <Text as="span" variant="p3semi">
            {exchangeRate.toString()}
          </Text>
        </div>
      ) : null}
    </Card>
  )
}
