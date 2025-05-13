import { type CSSProperties } from 'react'
import { Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import graphIcon from '@/public/img/misc/graph_icon.svg'

import notEnoughDataStyles from './NotEnoughData.module.css'

export const NotEnoughData = ({ style }: { style?: CSSProperties }) => {
  return (
    <div className={notEnoughDataStyles.notEnoughDataInfo} style={style}>
      <Image
        src={graphIcon}
        alt="Not enough data to show this graph"
        style={{ marginBottom: '20px' }}
      />
      <Text variant="p2semi" style={{ marginBottom: '8px' }}>
        Not enough data to show this graph
      </Text>
      <Text variant="p2">Please wait more time for data to accrue.</Text>
    </div>
  )
}
