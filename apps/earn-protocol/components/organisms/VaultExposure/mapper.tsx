import { TableCellText, TableRowAccent, Text, TokensGroup, WithArrow } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import Link from 'next/link'

import { type VaultExposureRawData } from '@/components/organisms/VaultExposure/VaultExposure'

export const vaultExposureMapper = (rawData: VaultExposureRawData[]) => {
  return rawData.map((item) => {
    return {
      content: {
        vault: (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-x-small)' }}
          >
            <TableRowAccent backgroundColor="var(--earn-protocol-accent-1-100)" />
            <TokensGroup
              tokens={[item.vault.primaryToken, item.vault.secondaryToken]}
              variant="s"
            />
            <TableCellText>{item.vault.label}</TableCellText>
          </div>
        ),
        allocation: <TableCellText>{formatDecimalAsPercent(item.allocation)}</TableCellText>,
        currentApy: <TableCellText>{formatDecimalAsPercent(item.currentApy)}</TableCellText>,
        liquidity: <TableCellText>{formatCryptoBalance(item.liquidity)}</TableCellText>,
        type: <TableCellText>{item.type}</TableCellText>,
      },
      details: (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-medium)' }}
        >
          <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
            Why this vault?
          </Text>
          <Text
            as="p"
            variant="p3"
            style={{ color: 'var(--earn-protocol-secondary-100)', fontWeight: '500' }}
          >
            MetaMorpho Gauntlet MKR Blended was chosen for it’s performance track record, risk
            approach and asset exposure.
          </Text>
          <Link href="/">
            <WithArrow
              as="p"
              variant="p4semi"
              style={{ color: 'var(--earn-protocol-primary-100)' }}
            >
              Learn more
            </WithArrow>
          </Link>
        </div>
      ),
    }
  })
}
