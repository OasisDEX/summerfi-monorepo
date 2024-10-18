import { DataBlock, Icon, PillSelector } from '@summerfi/app-earn-ui'

import { PortfolioAssetsList } from '@/features/portfolio/components/PortfolioAssetsList/PortfolioAssetsList'

import classNames from './PotfolioAssets.module.scss'

const networks = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'mainnet',
    icon: <Icon iconName="ether_circle_color" variant="m" />,
  },
  {
    value: 'base',
    icon: <Icon iconName="base" variant="s" />,
  },
  {
    value: 'optimism',
    icon: <Icon iconName="op_circle" variant="m" />,
  },
  {
    value: 'arbitrum',
    icon: <Icon iconName="arb_circle" variant="m" />,
  },
]

export const PortfolioAssets = () => {
  return (
    <div className={classNames.wrapper}>
      <div className={classNames.headerWrapper}>
        <DataBlock
          title="Total Assets"
          value="$2,859,930.02"
          subValue="+1.54% Past Week"
          titleSize="large"
          valueSize="large"
          subValueSize="small"
        />
        <PillSelector
          options={networks}
          onSelect={() => null}
          defaultSelected={networks[0].value}
        />
      </div>
      <PortfolioAssetsList />
    </div>
  )
}
