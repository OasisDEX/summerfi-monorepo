'use client'
import { type FC } from 'react'
import { Card, getTwitterShareUrl, HeadingWithCards } from '@summerfi/app-earn-ui'

import yieldTrendStyles from './YieldTrendView.module.scss'

interface YieldTrendViewProps {}

export const YieldTrendView: FC<YieldTrendViewProps> = ({}) => {
  return (
    <div className={yieldTrendStyles.wrapper}>
      <HeadingWithCards
        title="DeFi Yield"
        description="Stop second guessing how much you should be earning on your crypto assets. Quickly see the median DeFi yield on specific assets from  top DeFi protocols, and how they compare to what you can earn by optimizing only the best of DeFi with Lazy Summer Protocol. "
        social={{
          linkToCopy: 'currentUrl',
          linkToShare: getTwitterShareUrl({
            url: 'currentUrl',
            text: 'Check out Lazy Summer Global Rebalance Activity!',
          }),
        }}
      />
      <Card variant="cardSecondary" className={yieldTrendStyles.topCardWrapper}>
        <div className={yieldTrendStyles.selectedVaultInfo}>asd</div>
        <Card>asd</Card>
      </Card>
    </div>
  )
}
