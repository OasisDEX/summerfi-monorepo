/* eslint-disable no-magic-numbers */
import { Button, Text, WithArrow } from '@summerfi/app-ui'
import { IconSettings } from '@tabler/icons-react'
import { init, useConnectWallet } from '@web3-onboard/react'

import { formatAddress } from '@/helpers/formatters'
import { initWeb3OnBoardConfig } from '@/helpers/init-web3-onboard'

import walletButtonStyles from './WalletButton.module.scss'

init(initWeb3OnBoardConfig)

export default () => {
  const [{ wallet }, connect] = useConnectWallet()

  const handleConnectButton = () => {
    connect()
  }

  const isConnected = wallet && wallet.accounts.length > 0

  return (
    <Button
      variant="secondarySmall"
      style={{
        backgroundColor: 'var(--color-neutral-10)',
        padding: '4px',
        height: '40px',
        boxShadow: 'var(--shadow-depth-1)',
      }}
      onClick={handleConnectButton}
    >
      {isConnected ? (
        <>
          <div className={walletButtonStyles.Icon}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={wallet.icon} width="20px" alt={`${wallet.label} Wallet`} />
          </div>
          <Text variant="p3" style={{ fontWeight: 300, margin: '0 20px' }}>
            {`${wallet.accounts[0].ens ?? formatAddress(wallet.accounts[0].address, 6)}`}
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
  )
}
