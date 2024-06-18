'use client'
import { useEffect, useState } from 'react'
import { Card, Icon, SkeletonLine, Text, Tooltip } from '@summerfi/app-ui'
import Link from 'next/link'

import { RaysApiResponse } from '@/server-handlers/rays'
import { RaysResponse } from '@/types/rays'

import classNames from '@/components/molecules/CriteriaList/CriteriaList.module.scss'

const getCriteriaItems = ({ userTypes }: { userTypes?: RaysApiResponse['userTypes'] }) => [
  {
    title: 'Active Ethereum wallet',
    tooltip: {
      title: 'A currently active position in...',
      description:
        'Maker, Aave, Compound, Morpho, Liquidity, Euler, Reflexer Finance, Spark, Frax, Pendle, Yearn, Aevo',
    },
    post: '$',
    done: !!userTypes?.includes('General Ethereum User'),
  },
  {
    title: 'Active DeFi user',
    tooltip: {
      title: 'A currently active position in...',
      description:
        'Maker, Aave, Compound, Morpho, Liquidity, Euler, Reflexer Finance, Spark, Frax, Pendle, Yearn, Aevo',
    },
    post: '$$',
    done: !!userTypes?.includes('DeFi User'),
  },
  {
    title: 'Summer.fi user',
    tooltip: {
      title: 'A currently active position in...',
      description:
        'Maker, Aave, Compound, Morpho, Liquidity, Euler, Reflexer Finance, Spark, Frax, Pendle, Yearn, Aevo',
    },
    post: '$$$',
    done: !!userTypes?.includes('SummerFi User'),
  },
  {
    title: 'Summer.fi power user',
    tooltip: {
      title: 'A currently active position in...',
      description:
        'Maker, Aave, Compound, Morpho, Liquidity, Euler, Reflexer Finance, Spark, Frax, Pendle, Yearn, Aevo',
    },
    post: '$$$$',
    done: !!userTypes?.includes('SummerFi Power User'),
  },
]

export const CriteriaList = () => {
  const [raysResponse, setRaysResponse] = useState<RaysResponse | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  // TODO to be taken from connected wallet
  const address = '0xbef4befb4f230f43905313077e3824d7386e09f8'

  useEffect(() => {
    setIsLoading(true)
    fetch(`/rays/api/rays?address=${address}`)
      .then((resp) => resp.json())
      .then((data) => {
        setRaysResponse(data as RaysResponse)
        setIsLoading(false)
      })
  }, [address])

  return (
    <div className={classNames.wrapper}>
      <Card variant="cardDark">
        <div className={classNames.cardContent}>
          <Text as="h5" variant="h5">
            Criteria
          </Text>
          <ul>
            {getCriteriaItems({ userTypes: raysResponse?.rays?.userTypes }).map((item) => (
              <li key={item.title} className={classNames.listItem}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      marginRight: '18px',
                      paddingBottom: 'var(--space-xxs)',
                    }}
                  >
                    {isLoading ? (
                      <SkeletonLine width={20} height={22} />
                    ) : (
                      <Icon
                        iconName={item.done ? 'checkmark_colorful' : 'close_colorful'}
                        size={item.done ? 20 : 15}
                      />
                    )}
                  </div>
                  <Text as="p" variant="p2" style={{ marginRight: 'var(--space-xs)' }}>
                    {item.title}
                  </Text>
                  <Tooltip
                    tooltip={
                      <div className={classNames.tooltipWrapper}>
                        <Text as="p" variant="p2semi" style={{ color: 'var(--color-primary-100' }}>
                          {item.tooltip.title}
                        </Text>
                        <Text as="p" variant="p2">
                          {item.tooltip.description}
                        </Text>
                      </div>
                    }
                    style={{ color: 'var(--color-primary-60' }}
                    tooltipWrapperStyles={{ minWidth: '300px' }}
                  >
                    <Icon iconName="tooltip" size={17} />
                  </Tooltip>
                </div>
                <Text
                  as="p"
                  variant="p3"
                  style={{ letterSpacing: 'var(--space-xxs)', color: 'var(--color-neutral-80)' }}
                >
                  {item.post}
                </Text>
              </li>
            ))}
          </ul>
          <Text as="p" variant="p3semi">
            <Link href="/">Read about Rays →</Link>
          </Text>
        </div>
      </Card>
    </div>
  )
}
