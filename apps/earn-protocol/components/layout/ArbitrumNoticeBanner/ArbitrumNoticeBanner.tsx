import { type FC } from 'react'
import { GlobalNoticeBanner } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'
import Link from 'next/link'

export const ArbitrumNoticeBanner: FC<{ vault: SDKVaultType | SDKVaultishType }> = ({ vault }) => {
  const isArbitrumUSDCVault =
    vault.protocol.network === 'ARBITRUM_ONE' && vault.inputToken.symbol === 'USDC' && vault.name === 'LazyVault_LowerRisk_USDC'

  return !isArbitrumUSDCVault ? null : (
    <GlobalNoticeBanner
      message={
        <>
          This Vault has suffered from a potential loss on the Silo susdx/usdc 127 market. Please
          read the full details in this{' '}
          <Link
            href="https://forum.summer.fi/t/rfc-arbitrum-usdc-vault-next-steps-dealing-with-usdx-bad-debt/458"
            style={{ textDecoration: 'underline' }}
            target="_blank"
          >
            forum post
          </Link>
        </>
      }
    />
  )
}
