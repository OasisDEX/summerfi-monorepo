import { type CSSProperties } from 'react'
import { getDisplayToken, Icon, riskColors, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import clsx from 'clsx'
import { capitalize } from 'lodash-es'

import { networkSDKChainIdIconMap } from '@/constants/network-id-to-icon'

import controlsSwitchTransactionViewStyles from './ControlsSwitchTransactionView.module.css'

export const VaultSwitchBox = ({
  title,
  tokenName,
  chainId,
  risk,
  isDaoManaged,
  apy,
  isLoading,
  amount,
  isCurrent,
  wrapperStyle,
}: {
  title: string
  tokenName: TokenSymbolsList
  chainId: SupportedNetworkIds
  risk: string
  apy?: number
  amount?: string
  isLoading?: boolean
  isDaoManaged?: boolean
  isCurrent?: boolean
  wrapperStyle?: CSSProperties
}) => (
  <div
    className={clsx(
      controlsSwitchTransactionViewStyles.vaultBox,
      isCurrent && controlsSwitchTransactionViewStyles.vaultBoxCurrent,
    )}
    style={
      isCurrent
        ? {
            width: '50%',
            ...wrapperStyle,
          }
        : wrapperStyle
    }
  >
    <Text variant="p4semi" className={controlsSwitchTransactionViewStyles.vaultBoxFromTo}>
      {title}
    </Text>
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      <Icon tokenName={tokenName} size={44} />
      <div style={{ position: 'absolute', top: '-3px', left: '-3px' }} data-testid="vault-network">
        {networkSDKChainIdIconMap(chainId)}
      </div>
    </div>
    <Text variant="h5" style={{ color: 'var(--color-text-primary)' }}>
      {getDisplayToken(tokenName)}
    </Text>
    <Text variant="p4semi" style={{ color: riskColors[risk as keyof typeof riskColors] }}>
      {capitalize(risk)} Risk
    </Text>
    <Text
      variant="p4semi"
      style={{ color: 'var(--color-text-primary-disabled)', textAlign: 'center' }}
    >
      {isDaoManaged ? (
        <>
          DAO Risk-Managed
          <br />
          <br />
        </>
      ) : (
        <>
          Risk-Managed
          <br />
          by Block Analitica
        </>
      )}
    </Text>
    {!!apy || !!amount ? <div className={controlsSwitchTransactionViewStyles.divider} /> : null}
    {!!apy && (
      <Text variant="p4semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
        Live&nbsp;APY:&nbsp;{formatDecimalAsPercent(apy)}
      </Text>
    )}
    {isLoading && !amount ? (
      <SkeletonLine width={100} height={14} style={{ margin: '5px 0' }} />
    ) : amount ? (
      <Text variant="p2semi" style={{ color: 'var(--color-text-primary)' }}>
        {amount ? `${formatCryptoBalance(amount)} ${tokenName}` : 'n/a'}
      </Text>
    ) : null}
  </div>
)
