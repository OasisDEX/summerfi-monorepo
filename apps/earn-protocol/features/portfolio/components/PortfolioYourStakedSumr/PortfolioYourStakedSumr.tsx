import { Card, DataModule, Expander, Icon, Text } from '@summerfi/app-earn-ui'

import portfolioYourStakedSumrStyles from './PortfolioYourStakedSumr.module.css'

export const PortfolioYourStakedSumr = () => {
  return (
    <div className={portfolioYourStakedSumrStyles.wrapper}>
      <Text variant="h4">Your staked SUMR</Text>
      <Card
        variant="cardGradientDark"
        style={{
          padding: '8px 14px',
        }}
      >
        <Expander
          title={
            <Text
              variant="p3semi"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Icon iconName="sumr" size={26} />
              Why Stake your SUMR
            </Text>
          }
        >
          <div style={{ padding: '0 24px' }}>
            <Text variant="p4">Yeah, why?</Text>
          </div>
        </Expander>
      </Card>
      <div className={portfolioYourStakedSumrStyles.portfolioYourStakedSumrCardsWrapper}>
        <div className={portfolioYourStakedSumrStyles.cardWrapper}>
          <DataModule
            dataBlock={{
              title: 'Staked SUMR',
              value: '554.24k $SUMR',
              subValue: '$672,323.18',
              titleSize: 'medium',
              valueSize: 'large',
            }}
            actionable={
              <Text
                variant="p3semi"
                style={{ color: 'var(--color-text-critical)', cursor: 'pointer' }}
              >
                Remove stake
              </Text>
            }
          />
        </div>
        <div className={portfolioYourStakedSumrStyles.cardWrapper}>
          <DataModule
            dataBlock={{
              title: 'SUMR Staking APY',
              value: '45.32%',
              subValue: (
                <Text variant="p3semi">
                  <span style={{ color: 'var(--color-text-success)' }}>
                    Earned: 20.3k SUMR ($33,122.63)
                  </span>
                  &nbsp;|&nbsp;
                  <span>251.18k $SUMR /Year ($333,322.83)</span>
                </Text>
              ),
              titleSize: 'medium',
              valueSize: 'large',
            }}
          />
        </div>
        <div className={portfolioYourStakedSumrStyles.cardWrapper}>
          <DataModule
            gradientBackground
            dataBlock={{
              title: 'SUMR Staking USD Yield',
              value: '5.32% ',
              subValue: (
                <Text variant="p3semi">
                  <span style={{ color: 'var(--color-text-success)' }}>Earned: $33,322.13</span>
                  &nbsp;|&nbsp;
                  <span>$251,323 /Year </span>
                </Text>
              ),
              titleSize: 'medium',
              valueSize: 'large',
            }}
          />
        </div>

        <div className={portfolioYourStakedSumrStyles.cardWrapper}>
          <DataModule
            dataBlock={{
              title: 'Lazy Summer Annulized Revenue',
              value: '$12,323,322.32',
              subValue: '1.3b Lazy Summer TVL',
              titleSize: 'medium',
              valueSize: 'large',
            }}
            actionable={
              <Text
                variant="p3semi"
                style={{ color: 'var(--earn-protocol-primary-100)', cursor: 'pointer' }}
              >
                Simulate USD yield payoff
              </Text>
            }
          />
        </div>
      </div>
    </div>
  )
}
