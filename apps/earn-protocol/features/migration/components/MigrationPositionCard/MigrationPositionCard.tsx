import { type FC } from 'react'
import { PositionCard, Text, TokenWithNetworkIcon } from '@summerfi/app-earn-ui'
import { type PlatformLogo, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'

import { platformLogoMap } from '@/helpers/platform-logo-map'

import classNames from './MigrationPositionCard.module.scss'

interface MigrationPositionCardProps {
  id: string
  platformLogo: PlatformLogo
  token: TokenSymbolsList
  depositAmount: string
  chainId: number
  selectedPosition: string | null
  handleSelectPosition: (id: string) => void
}

export const MigrationPositionCard: FC<MigrationPositionCardProps> = ({
  id,
  platformLogo,
  token,
  depositAmount,
  chainId,
  selectedPosition,
  handleSelectPosition,
}) => {
  return (
    <PositionCard
      key={id}
      isActive={selectedPosition === id}
      platformLogo={platformLogoMap[platformLogo]}
      title={{
        label: `${token} Deposit`,
        value: (
          <div className={classNames.migrationIconWrapper}>
            <TokenWithNetworkIcon tokenName={token} variant="small" chainId={chainId} />
            <Text variant="p3semi">{formatCryptoBalance(depositAmount)}</Text>
          </div>
        ),
      }}
      list={
        [
          // {
          //   label: 'Current 30d APY',
          //   value: formatDecimalAsPercent(current30dApy),
          // },
          // {
          //   label: 'Lazy Summer 30d APY',
          //   value: formatDecimalAsPercent(lazySummer30dApy),
          // },
          // {
          //   label: '30d APY Differential',
          //   value: formatDecimalAsPercent(thirtydApyDifferential),
          // },
        ]
      }
      handleClick={() => handleSelectPosition(id)}
      // banner={
      //   <Text variant="p3semi">
      //     You&apos;re missing out on{' '}
      //     <Text
      //       as="span"
      //       variant="p3semiColorful"
      //       style={{ color: 'var(--earn-protocol-primary-100)' }}
      //     >
      //       ${formatFiatBalance(missingOutAmount)}/Year
      //     </Text>
      //   </Text>
      // }
    />
  )
}
