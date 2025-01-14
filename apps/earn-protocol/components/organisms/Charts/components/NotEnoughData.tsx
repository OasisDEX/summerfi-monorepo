import { Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import graphIcon from '@/public/img/misc/graph_icon.svg'

import notEnoughDataStyles from './NotEnoughData.module.scss'

export const NotEnoughData = ({ daysToWait }: { daysToWait: number }) => {
  return (
    <div className={notEnoughDataStyles.notEnoughDataInfo}>
      <Image
        src={graphIcon}
        alt="Not enough data to show this graph"
        style={{ marginBottom: '20px' }}
      />
      <Text variant="p2semi" style={{ marginBottom: '8px' }}>
        Not enough data to show this graph
      </Text>
      <Text variant="p2">Please wait {daysToWait} days for data to accrue.</Text>
    </div>
  )
}
