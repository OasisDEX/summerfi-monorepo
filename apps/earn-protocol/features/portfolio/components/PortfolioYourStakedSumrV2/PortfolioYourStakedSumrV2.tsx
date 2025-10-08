import {
  Button,
  Card,
  DataModule,
  Expander,
  GradientBox,
  Icon,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import Link from 'next/link'

import portfolioYourStakedSumrStyles from './PortfolioYourStakedSumrV2.module.css'

const NoSumrBanner = () => {
  return (
    <GradientBox selected className={portfolioYourStakedSumrStyles.noSumrGradientBox}>
      <Card variant="cardPrimary" className={portfolioYourStakedSumrStyles.noSumrBanner}>
        <Text variant="p1semi" className={portfolioYourStakedSumrStyles.noSumrTextDisabled}>
          You don’t have earned SUMR yet
          <div className={portfolioYourStakedSumrStyles.noSumrInner}>
            <Icon iconName="sumr" size={44} />
            <Text variant="h2" className={portfolioYourStakedSumrStyles.noSumrCount}>
              45,232
            </Text>
          </div>
        </Text>
        <Button variant="primaryMedium">Claim & Stake your SUMR</Button>
      </Card>
    </GradientBox>
  )
}

const WhyStakeSumr = () => {
  const whyStakeSumrCards = [
    {
      id: 1,
      title: <>Earn SUMR and real USD Yield for staking.</>,
    },
    {
      id: 2,
      title: <>Boost your rewards with time bound lockups. </>,
    },
    {
      id: 3,
      title: (
        <>
          Earn a share of real
          <br />
          protocol revenue.
        </>
      ),
    },
  ]

  return (
    <Card variant="cardGradientDark" className={portfolioYourStakedSumrStyles.whyCard}>
      <Expander
        title={
          <Text variant="p3semi" className={portfolioYourStakedSumrStyles.expanderTitle}>
            <Icon iconName="sumr" size={26} />
            Why Stake your SUMR
          </Text>
        }
      >
        <div className={portfolioYourStakedSumrStyles.expanderContent}>
          <Text
            as="div"
            variant="p2semi"
            className={portfolioYourStakedSumrStyles.expanderDescription}
          >
            Stake SUMR to earn boosted rewards, share in protocol revenues, and gain real governance
            power—all while turning your tokens into a yield-bearing asset.
          </Text>
          <Link href="#">
            <WithArrow>Read the details</WithArrow>
          </Link>
          <div className={portfolioYourStakedSumrStyles.whyCardsRow}>
            {whyStakeSumrCards.map((card) => (
              <GradientBox
                selected
                className={portfolioYourStakedSumrStyles.whyGradientBox}
                key={card.id}
              >
                <Card
                  variant="cardGradientLight"
                  className={portfolioYourStakedSumrStyles.whyCardInner}
                >
                  <Button
                    variant="primaryLarge"
                    className={portfolioYourStakedSumrStyles.whyCardButton}
                  >
                    {card.id}
                  </Button>
                  <Text variant="p1semi" className={portfolioYourStakedSumrStyles.centerText}>
                    {card.title}
                  </Text>
                </Card>
              </GradientBox>
            ))}
          </div>
          <Button variant="primaryLarge" className={portfolioYourStakedSumrStyles.stakeButton}>
            Stake SUMR
            <Icon iconName="stars" />
          </Button>
        </div>
      </Expander>
    </Card>
  )
}

export const PortfolioYourStakedSumrV2 = () => {
  return (
    <div className={portfolioYourStakedSumrStyles.wrapper}>
      <Text variant="h4">Your staked SUMR</Text>
      <WhyStakeSumr />
      <NoSumrBanner />
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
              <Text variant="p3semi" className={portfolioYourStakedSumrStyles.actionableCritical}>
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
                  <span className={portfolioYourStakedSumrStyles.textSuccess}>
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
                  <span className={portfolioYourStakedSumrStyles.textSuccess}>
                    Earned: $33,322.13
                  </span>
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
              <Text variant="p3semi" className={portfolioYourStakedSumrStyles.actionablePrimary}>
                Simulate USD yield payoff
              </Text>
            }
          />
        </div>
      </div>
    </div>
  )
}
