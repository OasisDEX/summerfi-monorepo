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
    icon: <Icon iconName="network_ethereum" variant="m" />,
  },
  {
    value: 'base',
    icon: <Icon iconName="network_base" variant="m" />,
  },
  {
    value: 'optimism',
    icon: <Icon iconName="network_optimism" variant="m" />,
  },
  {
    value: 'arbitrum',
    icon: <Icon iconName="network_arbitrum" variant="m" />,
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
