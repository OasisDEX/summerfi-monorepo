import { type FC } from 'react'
import { GlobalNoticeBanner } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'

export const ArbitrumNoticeBanner: FC<{ vault: SDKVaultType | SDKVaultishType }> = ({ vault }) => {
  const isArbitrumUSDCVault =
    vault.protocol.network === 'ARBITRUM_ONE' && vault.inputToken.symbol === 'USDC'

  return !isArbitrumUSDCVault ? null : (
    <GlobalNoticeBanner
      message={
        <>
          Due to ongoing issues with Arbitrum&apos;s USDC bridge, withdrawals from this vault may be
          delayed. We are actively working with Arbitrum to resolve the situation. For the latest
          updates, please visit our{' '}
          <a
            href="https://discord.gg/summerfi"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline' }}
          >
            Discord
          </a>{' '}
          or contact support at <a href="mailto:support@summer.fi">support@summer.fi</a>.
        </>
      }
    />
  )
}
