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
          This unusually high APY is coming from a market with very limited liquidity, where assets
          cannot be currently withdrawn. At this moment, it is not known when the assets will be
          redeemed and accessible within the Vault. The Risk Manager has set the deposit caps to
          this Vault to 0 (Zero) and it is no longer accepting new deposits.
        </>
      }
    />
  )
}
