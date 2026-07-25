import { type FC, useState } from 'react'
import {
  DataBlock,
  Icon,
  LoadableAvatar,
  SkeletonLine,
  Text,
  useEarnProtocolWallet,
} from '@summerfi/app-earn-ui'
import { formatAddress, formatCryptoBalance, safeBTOA } from '@summerfi/app-utils'
import clsx from 'clsx'

import { useRevalidateUser } from '@/hooks/use-revalidate'

import classNames from './PortfolioHeader.module.css'

interface PortfolioHeaderProps {
  viewWalletAddress: string
  totalSumr?: number
  isLoading?: boolean
  isOwner?: boolean
}

export const PortfolioHeader: FC<PortfolioHeaderProps> = ({
  viewWalletAddress,
  totalSumr,
  isLoading = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { address: userWallet } = useEarnProtocolWallet()

  const revalidateUser = useRevalidateUser()

  const handleUserRefresh = () => {
    revalidateUser(userWallet)
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 5000)
  }

  return (
    <>
      <div className={classNames.firstRowWrapper}>
        <Text
          as="h2"
          variant="h2"
          className={clsx(classNames.headerWrapper, {
            [classNames.refreshing]: isRefreshing,
          })}
        >
          Portfolio
          <div onClick={handleUserRefresh}>
            <Icon iconName="refresh" size={16} />
          </div>
        </Text>
      </div>
      <div className={classNames.secondRowWrapper}>
        <div className={classNames.secondRowContainer}>
          <div style={{ display: 'flex', gap: 'var(--spacing-space-small)', alignItems: 'center' }}>
            <LoadableAvatar
              fallback={
                <svg
                  viewBox="0 0 6.35 6.35"
                  color="inherit"
                  display="inline-block"
                  width={36}
                  height={36}
                >
                  <circle
                    style={{ fill: '#9d9d9d', fillOpacity: 0.35, strokeWidth: 0.34 }}
                    cx="3.175"
                    cy="3.175"
                    r="3.175"
                  />
                </svg>
              }
              size={36}
              name={safeBTOA(viewWalletAddress)}
              variant="pixel"
              colors={['#B90061', '#EC58A2', '#F8A4CE', '#FFFFFF']}
            />
            <Text as="p" variant="p1semi">
              {!isLoading ? (
                formatAddress(viewWalletAddress, { first: 6 })
              ) : (
                <SkeletonLine width={220} height={20} />
              )}
            </Text>
          </div>
        </div>
        <div className={classNames.dataBlocksContainer}>
          <DataBlock
            title="Total $SUMR"
            value={totalSumr ? formatCryptoBalance(totalSumr) : '-'}
            titleSize="large"
            valueSize="large"
            valueStyle={{ textAlign: 'right' }}
          />
        </div>
      </div>
    </>
  )
}
