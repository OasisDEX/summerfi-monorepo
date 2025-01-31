import { type FC, useState } from 'react'
import { useUser } from '@account-kit/react'
import { Button, DataBlock, Dropdown, Icon, LoadableAvatar, Text } from '@summerfi/app-earn-ui'
import { type DropdownRawOption } from '@summerfi/app-types'
import { formatAddress, formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'
import clsx from 'clsx'

import { TransakWidget } from '@/features/transak/components/TransakWidget/TransakWidget'
import { transakNetworkOptions } from '@/features/transak/consts'
import { type TransakNetworkOption } from '@/features/transak/types'
import { revalidateUser } from '@/helpers/revalidate-user'
import { useUserWallet } from '@/hooks/use-user-wallet'

import classNames from './PortfolioHeader.module.scss'

const TransakTrigger = ({
  isOpen,
  isDisabled = false,
}: {
  isOpen: boolean
  isDisabled?: boolean
}) => (
  <Button variant="primaryMedium" style={{ minWidth: '130px' }} disabled={isDisabled}>
    <Text as="span" variant="p3semi">
      Add funds
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
  totalSumr: number
  totalWalletValue: number
}

export const PortfolioHeader: FC<PortfolioHeaderProps> = ({
  walletAddress,
  totalSumr,
  totalWalletValue,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { userWalletAddress } = useUserWallet()
  const [isTransakOpen, setIsTransakOpen] = useState(false)
  const [transakNetwork, setTransakNetwork] = useState<TransakNetworkOption | null>(null)
  const user = useUser()

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
            <Icon iconName="refresh" size={14} />
          </div>
        </Text>
        <div style={{ display: 'flex', gap: 'var(--spacing-space-x-small)' }}>
          {/* <Button variant="secondaryLarge" style={{ minWidth: 'unset' }}>
            Send
          </Button>
          <Button variant="secondaryLarge" style={{ minWidth: 'unset' }}>
            Swap
          </Button> */}
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
        <div style={{ display: 'flex', gap: 'var(--spacing-space-x-small)', alignItems: 'center' }}>
          <LoadableAvatar
            size={48}
            name={btoa(walletAddress)}
            variant="pixel"
            colors={['#B90061', '#EC58A2', '#F8A4CE', '#FFFFFF']}
          />
          <Text as="p" variant="p1semi">
            {formatAddress(walletAddress, { first: 6 })}
          </Text>
          {/* <Icon iconName="edit" color="rgba(255, 73, 164, 1)" variant="s" /> */}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-space-large)',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <DataBlock
            title="Total $SUMR"
            value={formatCryptoBalance(totalSumr)}
            titleSize="large"
            valueSize="large"
            valueStyle={{ textAlign: 'right' }}
          />
          <DataBlock
            title="Total Wallet Value"
            value={`$${formatFiatBalance(totalWalletValue)}`}
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
    </>
  )
}
