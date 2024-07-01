'use client'
import { FC, useEffect, useState } from 'react'
import { Icon, Text } from '@summerfi/app-ui'
import { useConnectWallet } from '@web3-onboard/react'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { basePath } from '@/helpers/base-path'
import { formatCryptoBalance } from '@/helpers/formatters'
import { RaysApiResponse } from '@/server-handlers/rays'

import raysCountComponentStyles from './RaysCountComponent.module.scss'

export const RaysCountComponent: FC = () => {
  const [{ wallet }] = useConnectWallet()
  const [loadingRaysCount, setLoadingRaysCount] = useState<boolean>(false)
  const [raysCount, setRaysCount] = useState<number | null>(null)

  useEffect(() => {
    if (wallet?.accounts[0].address) {
      setLoadingRaysCount(true)
      fetch(`${basePath}/api/rays?address=${wallet.accounts[0].address}`)
        .then((resp) => resp.json())
        .then(
          (
            response:
              | {
                  rays: RaysApiResponse
                  error?: undefined
                }
              | {
                  error: unknown
                  rays?: undefined
                },
          ) => {
            if (response.rays?.allPossiblePoints !== undefined) {
              setLoadingRaysCount(false)
              setRaysCount(response.rays.allPossiblePoints)
            }
          },
        )
    }
  }, [wallet?.accounts])

  return raysCount !== null && !loadingRaysCount ? (
    <Link
      href={{
        pathname: '/',
        query: { userAddress: wallet?.accounts[0].address },
      }}
      style={{ textDecoration: 'none' }}
    >
      <div className={raysCountComponentStyles.raysCountWrapper}>
        <Icon iconName="rays" size={24} />
        <Text variant="p4semi" className={raysCountComponentStyles.raysCount}>
          {formatCryptoBalance(new BigNumber(raysCount)).split('.')[0]} Rays
        </Text>
      </div>
    </Link>
  ) : null
}
