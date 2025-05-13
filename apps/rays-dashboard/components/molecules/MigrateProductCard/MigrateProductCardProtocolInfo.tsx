import { type TokenSymbolsList } from '@summerfi/app-types'
import { Text, TokensGroup } from '@summerfi/app-ui'

import { type LendingProtocolConfig } from '@/helpers/lending-protocols-configs'

import migrateProductCardStyles from '@/components/molecules/MigrateProductCard/MigrateProductCard.module.css'

export const MigrateProductCardProtocolInfo = ({
  tokens,
  protocolConfig,
}: {
  tokens: TokenSymbolsList[]
  protocolConfig: LendingProtocolConfig
}) => (
  <div className={migrateProductCardStyles.protocolInfoWrapper}>
    <TokensGroup tokens={tokens} />
    <div className={migrateProductCardStyles.protocolInfo}>
      <Text as="p" variant="p1semi">
        {tokens.join('/')}
      </Text>
      <Text as="p" variant="p3" style={{ color: 'var(--color-neutral-80)' }}>
        {protocolConfig.label}
      </Text>
    </div>
  </div>
)
