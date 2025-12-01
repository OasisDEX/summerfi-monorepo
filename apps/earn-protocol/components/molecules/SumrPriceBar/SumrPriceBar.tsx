import { type FC } from 'react'
import { Button, DataBlock, DataModule, Icon, Text, Tooltip } from '@summerfi/app-earn-ui'

import sumrPriceBarStyles from './SumrPriceBar.module.css'

interface SumrPriceBarProps {
  // to be extended in the future
}

const TrendDatablock = ({
  timespan,
  value,
  trend,
}: {
  timespan: string
  value: string
  trend: 'positive' | 'negative'
}) => {
  return (
    <DataBlock
      wrapperClassName={sumrPriceBarStyles.sumrPriceDataBlock}
      title={`${timespan} Trend`}
      size="xsmall"
      value={
        <span>
          {value}&nbsp;
          <Icon
            iconName="arrow_forward"
            style={{
              transform:
                trend === 'positive'
                  ? 'rotate(-45deg) translateX(-1px)'
                  : 'rotate(45deg) translateX(1px)',
            }}
            size={16}
          />
        </span>
      }
      valueType={trend}
    />
  )
}

export const SumrPriceBar: FC<SumrPriceBarProps> = () => {
  return (
    <DataModule
      dataBlock={{
        title: (
          <div className={sumrPriceBarStyles.sumrPriceTitle}>
            <Text variant="p2semi">$SUMR Price</Text>
            <Button variant="unstyled" style={{ cursor: 'not-allowed' }}>
              <Tooltip
                tooltip={<>Starts trading Jan.&nbsp;21.&nbsp;2026</>}
                tooltipWrapperStyles={{ minWidth: '140px' }}
              >
                <Text variant="p3semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
                  Buy SUMR
                </Text>
              </Tooltip>
            </Button>
          </div>
        ),
        titleWithIconClassName: sumrPriceBarStyles.titleWithIconFullWidth,
        value: '$1.33 SUMR/USD',
        titleSize: 'medium',
        valueSize: 'large',
        subValue: (
          <div className={sumrPriceBarStyles.sumrPriceDataBlocks}>
            <DataBlock
              wrapperClassName={sumrPriceBarStyles.sumrPriceDataBlock}
              title="Market Cap"
              size="xsmall"
              value="$1,330,000,000"
            />
            <div className={sumrPriceBarStyles.sumrPriceDataBlocksDivider} />
            <DataBlock
              wrapperClassName={sumrPriceBarStyles.sumrPriceDataBlock}
              title="Fully Diluted Valuation"
              size="xsmall"
              value="$12,330,000,000"
            />
            <div className={sumrPriceBarStyles.sumrPriceDataBlocksDivider} />
            <DataBlock
              wrapperClassName={sumrPriceBarStyles.sumrPriceDataBlock}
              title="SUMR Holders"
              size="xsmall"
              value="44,323"
            />
            <div className={sumrPriceBarStyles.sumrPriceDataBlocksDivider} />
            <TrendDatablock timespan="7d" value="1.34% " trend="positive" />
            <div className={sumrPriceBarStyles.sumrPriceDataBlocksDivider} />
            <TrendDatablock timespan="30d" value="3.34% " trend="negative" />
            <div className={sumrPriceBarStyles.sumrPriceDataBlocksDivider} />
            <TrendDatablock timespan="90d" value="14.34% " trend="positive" />
          </div>
        ),
        titleStyle: {
          width: '100%',
        },
        wrapperStyles: {
          width: '100%',
        },
      }}
    />
  )
}
