import { Text } from '@summerfi/app-earn-ui'

export const SumrPageFootnote = () => {
  return (
    <Text
      variant="p2"
      style={{
        color: 'var(--earn-protocol-secondary-70)',
        marginTop: 'var(--general-space-64)',
        textAlign: 'center',
      }}
    >
      <span style={{ position: 'relative' }}>
        Highest{' '}
        <Text
          as="span"
          variant="p4"
          style={{
            position: 'absolute',
            top: '-4px',
            left: '-7px',
            fontSize: '11px',
          }}
        >
          1
        </Text>
      </span>{' '}
      quality yields is based on a variety of factors, including TVL, longevity of underlying
      protocol, reputation of team and known past exploits
    </Text>
  )
}
