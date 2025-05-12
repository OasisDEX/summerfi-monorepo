import { Text } from '@/components/atoms/Text/Text'

import styles from './HighestQualityYieldsDisclaimer.module.css'

export const HighestQualityYieldsDisclaimer = (): React.ReactNode => {
  return (
    <Text variant="p2" className={styles.disclaimer}>
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
