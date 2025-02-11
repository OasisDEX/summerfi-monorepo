import { Text } from '@/components/atoms/Text/Text'

export const HighestQualityYieldsDisclaimer = () => {
  return (
    <Text
      variant="p2"
      style={{
        color: 'var(--earn-protocol-secondary-70)',
        textAlign: 'center',
        marginBottom: 'var(--general-space-128)',
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
