import { useLayoutEffect, useRef, useState } from 'react'
import { Button, Divider, EXTERNAL_LINKS, INTERNAL_LINKS, Text, WithArrow } from '@summerfi/app-ui'
import { formatAddress, formatCryptoBalance } from '@summerfi/app-utils'
import { IconCopy, IconLogout, IconSettings } from '@tabler/icons-react'
import { type WalletState } from '@web3-onboard/core'
import { useConnectWallet } from '@web3-onboard/react'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import walletButtonStyles from './WalletButton.module.css'

const WalletIcon = ({
  wallet,
  active = true,
  onClick = false,
}: {
  wallet: WalletState | null
  active?: boolean
  onClick?: (() => void) | false
}) => (
  <div
    className={walletButtonStyles.Icon}
    onClick={onClick ? () => onClick() : undefined}
    style={onClick ? { cursor: 'pointer' } : { cursor: 'default' }}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={wallet?.icon}
      width="20px"
      alt={`${wallet?.label ?? 'Error?'} Wallet`}
      style={active ? { opacity: 1 } : { opacity: 0.2 }}
    />
  </div>
)

const WalletAccount = ({
  account,
  wallet,
  setPrimaryWallet,
}: {
  account: WalletState['accounts'][0]
  wallet: WalletState
  setPrimaryWallet: (wallet: WalletState, address: string) => void
}) => {
  const clipboardContentRef = useRef<HTMLTextAreaElement>(null)

  async function copyToClipboard() {
    const clipboardContent = clipboardContentRef.current

    if (clipboardContent) {
      clipboardContent.select()
      try {
        await navigator.clipboard.writeText(clipboardContent.value)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to copy to clipboard:', error)
      }
    }
  }

  return (
    <div key={account.address} className={walletButtonStyles.WalletAccount}>
      <WalletIcon
        wallet={wallet}
        active={account.address === wallet.accounts[0].address}
        onClick={() => {
          setPrimaryWallet(wallet, account.address)
        }}
      />
      <div className={walletButtonStyles.WalletAccountInfo}>
        <Text variant="p3semi" style={{ margin: '0 20px' }}>
          {account.ens?.name ?? formatAddress(account.address, { first: 6 })}
        </Text>
        {account.balance && (
          <Text variant="p4" className={walletButtonStyles.BalanceData}>
            {Object.keys(account.balance)
              .map(
                (key) =>
                  `${formatCryptoBalance(new BigNumber(account.balance?.[key] ?? 0))} ${key}`,
              )
              .join(', ')}
          </Text>
        )}
      </div>
      <Text
        variant="p4semi"
        className={walletButtonStyles.CopyButton}
        onClick={() => copyToClipboard()}
      >
        copy&nbsp;address
      </Text>
      <textarea
        ref={clipboardContentRef}
        style={{ position: 'absolute', top: '-1000px', left: '-1000px' }}
        value={account.address}
        readOnly
      />
    </div>
  )
}

export default () => {
  const [{ wallet }, connect, disconnect, _updateBalances, _setWalletModules, setPrimaryWallet] =
    useConnectWallet()
  const [infoBoxOpened, setInfoBoxOpened] = useState(false)

  const isConnected = wallet && wallet.accounts.length > 0

  const handleConnectButtonClick = () => {
    if (isConnected) {
      setInfoBoxOpened(true)
    } else {
      connect()
    }
  }

  useLayoutEffect(() => {
    if (infoBoxOpened) {
      const closeInfoBox = () => {
        setInfoBoxOpened(false)
      }

      const listener = document.querySelectorAll(`.${walletButtonStyles.Overlay}`)

      listener[0].addEventListener('click', closeInfoBox)

      return () => {
        listener[0].removeEventListener('click', closeInfoBox)
      }
    }

    return () => {}
  }, [infoBoxOpened])

  return (
    <div className={walletButtonStyles.ButtonWrapper}>
      <Button
        variant="secondarySmall"
        className={walletButtonStyles.ButtonStyles}
        onClick={handleConnectButtonClick}
      >
        {isConnected ? (
          <>
            <WalletIcon wallet={wallet} />
            <Text variant="p3" style={{ fontWeight: 300, margin: '0 20px' }}>
              {`${wallet.accounts[0].ens?.name ?? formatAddress(wallet.accounts[0].address, { first: 6 })}`}
            </Text>
            <IconSettings
              strokeWidth={2}
              size={20}
              color="var(--color-neutral-80)"
              style={{ marginRight: '5px' }}
            />
          </>
        ) : (
          <div
            style={{
              marginRight: 'var(--space-xl)',
              marginLeft: 'var(--space-m)',
            }}
          >
            <WithArrow gap={0} variant="p2semi">
              Connect Wallet
            </WithArrow>
          </div>
        )}
      </Button>
      {isConnected && (
        <div
          className={`${walletButtonStyles.InfoBox}${infoBoxOpened ? ` ${walletButtonStyles.InfoBoxActive}` : ''}`}
        >
          <Text variant="p1semi" style={{ margin: '0 0 20px 0' }}>
            Wallet
          </Text>
          {[...wallet.accounts]
            .sort((a, b) => {
              if (a.address < b.address) return -1
              if (a.address > b.address) return 1

              return 0
            })
            .map((account) => (
              <WalletAccount
                key={account.address}
                account={account}
                wallet={wallet}
                setPrimaryWallet={setPrimaryWallet}
              />
            ))}
          <Text variant="p1semi" style={{ margin: '10px 0' }}>
            Referrals
          </Text>
          <Text variant="p3" style={{ margin: '0 0 10px 0' }}>
            Refer a friend to us and each of you get rewarded with 5% of all fees that your friend
            generates on Summer.fi... forever! Read more about{' '}
            <Link href={EXTERNAL_LINKS.KB.REFER_A_FRIEND} target="_blank">
              Summer.fi Refer a Friend
            </Link>
          </Text>
          <Button
            variant="neutralSmall"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  `${INTERNAL_LINKS.appUrl}?ref=${wallet.accounts[0].address}`,
                )
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Failed to copy to clipboard:', error)
              }
            }}
          >
            <IconCopy size={16} color="var(--color-neutral-60)" />
            Copy your active wallet referral link
          </Button>
          <Text variant="p1semi" style={{ margin: '20px 0 15px 0' }}>
            Slippage settings
          </Text>
          <Text variant="p3" style={{ margin: '0 0 10px 0' }}>
            If you want to change the slippage settings please go to the home page.
          </Text>
          <Divider
            style={{
              margin: '20px 0 0 0',
            }}
          />
          <Button
            variant="unstyled"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 'var(--space-m) 0 0',
              color: 'var(--color-neutral-80)',
            }}
            onClick={() => {
              disconnect(wallet)
              setInfoBoxOpened(false)
            }}
          >
            <IconLogout
              strokeWidth={1}
              size={20}
              color="var(--color-neutral-80)"
              style={{ marginRight: '10px' }}
            />
            Disconnect Wallet
          </Button>
        </div>
      )}
      {infoBoxOpened && <div className={walletButtonStyles.Overlay} />}
    </div>
  )
}
