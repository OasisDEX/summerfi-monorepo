import { Icon, Text } from '@summerfi/app-earn-ui'

import styles from '@/components/layout/LandingPageContent/components/CheckLine.module.css'

export const CheckLine = ({ text }: { text: string }) => {
  return (
    <div className={styles.checkLine}>
      <Icon iconName="checkmark" size={18} />
      <Text as="p" variant="p2" className={styles.checkLineBody}>
        {text}
      </Text>
    </div>
  )
}
