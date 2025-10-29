'use client'
import { type FC } from 'react'
import { Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import sumrBigCircle from '@/public/img/sumr/sumr_big_circle.svg'

import sumrV2PageStyles from './SumrV2PageHeader.module.css'

export const SumrV2PageHeader: FC = () => {
  return (
    <div className={sumrV2PageStyles.sumrPageV2Wrapper}>
      <Image
        src={sumrBigCircle}
        alt="$SUMR - Powering DeFi's best yield optimizer"
        className={sumrV2PageStyles.sumrBigCircle}
      />
      <Text variant="h2" className={sumrV2PageStyles.header}>
        Stake your SUMR and earn real USD yield
        <br />
        from Lazy Summer Protocol revenues.
      </Text>
    </div>
  )
}
