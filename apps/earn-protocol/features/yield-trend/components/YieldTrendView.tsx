import { HeadingWithCards } from '@summerfi/app-earn-ui'

import yieldTrendViewStyles from './YieldTrendView.module.css'

export const YieldTrendView = () => {
  return (
    <div className={yieldTrendViewStyles.wrapper}>
      <HeadingWithCards
        title="DeFi Yield"
        description="Stop second guessing how much you should be earning on your crypto assets. Quickly see the median DeFi yield on specific assets from  top DeFi protocols, and how they compare to what you can earn by optimizing only the best of DeFi with Lazy Summer Protocol. "
      />
    </div>
  )
}
