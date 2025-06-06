import { type FC, useState } from 'react'
import { useUser } from '@account-kit/react'
import {
  Button,
  DataBlock,
  Dropdown,
  Icon,
  LoadableAvatar,
  SkeletonLine,
  Text,
} from '@summerfi/app-earn-ui'
import { type DropdownRawOption } from '@summerfi/app-types'
import {
  formatAddress,
  formatCryptoBalance,
  formatFiatBalance,
  safeBTOA,
} from '@summerfi/app-utils'
import clsx from 'clsx'
import Link from 'next/link'

import { type PortfolioAssetsResponse } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { SendWidget } from '@/features/send/components/SendWidget/SendWidget'
import { TransakWidget } from '@/features/transak/components/TransakWidget/TransakWidget'
import { transakNetworkOptions } from '@/features/transak/consts'
import { type TransakNetworkOption } from '@/features/transak/types'
import { revalidateUser } from '@/helpers/revalidation-handlers'
import { useUserWallet } from '@/hooks/use-user-wallet'

import classNames from './PortfolioHeader.module.css'

const TransakTrigger = ({
  isOpen,
  isDisabled = false,
}: {
  isOpen: boolean
  isDisabled?: boolean
}) => (
  <Button variant="primaryMedium" style={{ minWidth: '130px' }} disabled={isDisabled}>
    <Text as="span" variant="p3semi">
      Buy crypto
    </Text>
    <Icon
      iconName={isOpen ? 'chevron_up' : 'chevron_down'}
      style={{
        color: isDisabled
          ? 'var(--earn-protocol-secondary-40)'
          : 'var(--earn-protocol-secondary-100)',
      }}
      variant="xs"
    />
  </Button>
)

interface PortfolioHeaderProps {
  walletAddress: string
  totalSumr?: number
  totalWalletValue?: number
  isLoading?: boolean
  walletData?: PortfolioAssetsResponse
  isOwner?: boolean
}

export const PortfolioHeader: FC<PortfolioHeaderProps> = ({
  walletAddress,
  totalSumr,
  totalWalletValue,
  isLoading = false,
  walletData,
  isOwner,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { userWalletAddress } = useUserWallet()
  const [isTransakOpen, setIsTransakOpen] = useState(false)
  const [isSendOpen, setIsSendOpen] = useState(false)
  const [transakNetwork, setTransakNetwork] = useState<TransakNetworkOption | null>(null)
  const user = useUser()

  const { features } = useSystemConfig()

  const sendEnabled = !!features?.Send

  const handleNetworkSelect = (option: DropdownRawOption) => {
    setTransakNetwork(transakNetworkOptions.find((item) => item.value === option.value) ?? null)
    setIsTransakOpen(true)
  }

  const handleUserRefresh = () => {
    revalidateUser(userWalletAddress)
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
        <div style={{ display: 'flex', gap: 'var(--spacing-space-x-small)' }}>
          {sendEnabled && (
            <Button
              variant="secondaryMedium"
              style={{ minWidth: 'unset' }}
              disabled={
                userWalletAddress?.toLowerCase() !== walletAddress.toLowerCase() ||
                (walletData && walletData.assets.length === 0)
              }
              onClick={() => {
                setIsSendOpen(true)
              }}
            >
              Send
            </Button>
          )}
          <Link href={`/bridge/${walletAddress}?via=portfolio`}>
            <Button
              variant="secondaryMedium"
              style={{ minWidth: 'unset' }}
              disabled={userWalletAddress?.toLowerCase() !== walletAddress.toLowerCase()}
            >
              Bridge
            </Button>
          </Link>
          <Dropdown
            dropdownValue={{ value: transakNetwork?.value ?? '', content: null }}
            trigger={TransakTrigger}
            isDisabled={userWalletAddress?.toLowerCase() !== walletAddress.toLowerCase()}
            options={transakNetworkOptions.map((option) => ({
              value: option.value,
              content: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon iconName={option.iconName} />
                  <span>{option.label}</span>
                </div>
              ),
            }))}
            onChange={handleNetworkSelect}
          >
            {null}
          </Dropdown>
        </div>
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
              name={safeBTOA(walletAddress)}
              variant="pixel"
              colors={['#B90061', '#EC58A2', '#F8A4CE', '#FFFFFF']}
            />
            <Text as="p" variant="p1semi">
              {!isLoading ? (
                formatAddress(walletAddress, { first: 6 })
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
          <DataBlock
            title="Total Wallet Value"
            value={totalWalletValue ? `$${formatFiatBalance(totalWalletValue)}` : '-'}
            titleSize="large"
            valueSize="large"
            valueStyle={{ textAlign: 'right' }}
          />
        </div>
      </div>
      {userWalletAddress && transakNetwork && (
        <TransakWidget
          cryptoCurrency="USDC"
          walletAddress={userWalletAddress}
          email={user?.email}
          isOpen={isTransakOpen}
          onClose={() => {
            setIsTransakOpen(false)
            setTransakNetwork(null)
          }}
          injectedNetwork={transakNetwork}
        />
      )}

      {walletData && walletData.assets.length > 0 && sendEnabled && (
        <SendWidget
          walletAddress={walletAddress}
          isOpen={isSendOpen}
          onClose={() => setIsSendOpen(false)}
          walletData={walletData}
          isOwner={isOwner}
        />
      )}
    </>
  )
}
