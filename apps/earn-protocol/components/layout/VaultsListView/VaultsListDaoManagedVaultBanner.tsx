import { Card, getDisplayToken, Icon, Text } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { formatDecimalAsPercent } from '@summerfi/app-utils'

import vaultsListViewStyles from './VaultsListView.module.css'

export const VaultsListDaoManagedVaultBanner = ({
  assets,
  highestApy,
  highestToken,
  onClick,
}: {
  assets: TokenSymbolsList[]
  highestApy: number
  highestToken: string
  onClick?: () => void
}) => {
  if (!assets.length) {
    return null
  }

  return (
    <Card className={vaultsListViewStyles.daoManagedVaultsBanner} onClick={onClick}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <Text variant="p2semi">
          Introducing
          <span className={vaultsListViewStyles.daoManagedVaultsBannerEmphasis}>
            DAO Risk-Managed Vaults
          </span>
        </Text>
        <Text
          variant="p3"
          style={{
            color: 'var(--color-text-secondary)',
          }}
        >
          Higher risk/reward Vaults designed to outperform
        </Text>
        <div className={vaultsListViewStyles.daoManagedVaultsBannerDataBlocks}>
          <div className={vaultsListViewStyles.daoManagedVaultsBannerDataBlock}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Supported assets
            </Text>
            <div style={{ display: 'flex', gap: '6px', width: 'fit-content' }}>
              {assets.map((asset) => (
                <Icon key={asset} tokenName={getDisplayToken(asset) as typeof asset} size={22} />
              ))}
            </div>
          </div>
          <div className={vaultsListViewStyles.daoManagedVaultsBannerDataBlock}>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Earn up to
            </Text>
            <div
              style={{ display: 'flex', gap: '6px', alignItems: 'center', width: 'fit-content' }}
            >
              <Icon iconName="stars" size={20} />
              <Text variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                {formatDecimalAsPercent(highestApy)} on {highestToken}
              </Text>
            </div>
          </div>
        </div>
      </div>
      <div className={vaultsListViewStyles.daoManagedVaultsBannerArrow}>
        <Icon iconName="arrow_forward" size={16} className="daoManagedVaultsBannerArrow" />
      </div>
    </Card>
  )
}
