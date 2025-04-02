'use client'
import { useEffect, useState } from 'react'
import { type RaysApiResponse } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'

import raysCountSmallStyles from './RaysCountSmall.module.scss'

type RaysCountSmallProps = {
  userAddress?: string
  formatter: (value: BigNumber) => string
  raysFetchFunction: () => Promise<
    | {
        rays: RaysApiResponse
        error?: undefined
      }
    | {
        error: unknown
        rays?: undefined
      }
  >
}

export const RaysCountSmall = ({
  userAddress,
  formatter,
  raysFetchFunction,
}: RaysCountSmallProps): React.ReactNode => {
  const [loadingRaysCount, setLoadingRaysCount] = useState<boolean>(false)
  const [raysCount, setRaysCount] = useState<number | null>(null)
  const [raysAddresses, setRaysAddresses] = useState<string[]>([])

  useEffect(() => {
    if (userAddress && !raysAddresses.includes(userAddress)) {
      setLoadingRaysCount(true)
      raysFetchFunction().then((response) => {
        setLoadingRaysCount(false)
        if (response.rays?.allPossiblePoints !== undefined) {
          setRaysAddresses([...raysAddresses, userAddress])
          setRaysCount(response.rays.allPossiblePoints)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress])

  return (
    <Link
      href={
        userAddress
          ? {
              pathname: '/',
              query: { userAddress },
            }
          : '/'
      }
      style={{ textDecoration: 'none' }}
      suppressHydrationWarning
    >
      <div className={raysCountSmallStyles.raysCountWrapper}>
        <Icon iconName="rays" size={24} />
        <Text variant="p4semi" suppressHydrationWarning>
          {loadingRaysCount ? (
            <SkeletonLine height={15} width={60} />
          ) : (
            <>
              {raysCount
                ? `${formatter(new BigNumber(raysCount)).split('.')[0]} Rays`
                : 'Get $RAYS'}
            </>
          )}
        </Text>
      </div>
    </Link>
  )
}
