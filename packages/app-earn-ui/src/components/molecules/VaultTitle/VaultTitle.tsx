import { type FC, type ReactNode } from 'react'
import {
  type NetworkIds,
  type SDKNetwork,
  type SDKVaultType,
  type TokenSymbolsList,
} from '@summerfi/app-types'

import { GenericTokenIcon } from '@/components/atoms/GenericTokenIcon/GenericTokenIcon'
import { Icon } from '@/components/atoms/Icon/Icon'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'
import type TextVariants from '@/components/atoms/Text/Text.module.css'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { networkWarnings } from '@/constants/earn-protocol'
import { networkIdIconNameMap, networkNameIconNameMap } from '@/constants/icon-maps'
import { getDisplayToken } from '@/helpers/get-display-token'
import { getTokenGuarded } from '@/tokens/helpers'

interface VaultTitleProps {
  symbol: SDKVaultType['inputToken']['symbol']
  networkId?: NetworkIds
  networkName?: SDKNetwork
  value?: ReactNode
  selected?: boolean
  titleVariant?: keyof typeof TextVariants
  isLoading?: boolean
  isVaultCard?: boolean
  iconSize?: number
}

export const VaultTitle: FC<VaultTitleProps> = ({
  symbol,
  value,
  networkId,
  networkName,
  selected,
  titleVariant = 'h4',
  isLoading,
  isVaultCard,
  iconSize = 44,
}) => {
  const resolvedSymbol = getDisplayToken(symbol)
  const isIconDefined = getTokenGuarded(resolvedSymbol)?.iconName

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {isLoading ? (
          <SkeletonLine height={iconSize} width={iconSize} />
        ) : isIconDefined ? (
          /* if any icon breaks, this is probably because of TokenSymbolsList vs whatever comes from the subgraph */
          <Icon tokenName={resolvedSymbol as TokenSymbolsList} size={iconSize} />
        ) : (
          <GenericTokenIcon symbol={resolvedSymbol} customSize={32} />
        )}
        {(networkId ?? networkName) && (
          <div
            style={{ position: 'absolute', top: '-3px', left: '-3px' }}
            data-testid="vault-network"
          >
            {networkId && networkIdIconNameMap[networkId] && (
              <Icon iconName={networkIdIconNameMap[networkId]} size={16} />
            )}
            {networkName && networkNameIconNameMap[networkName] && (
              <Icon iconName={networkNameIconNameMap[networkName]} size={16} />
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--general-space-8)', alignItems: 'center' }}>
          <Text
            as="h4"
            variant={titleVariant}
            style={{ color: 'white', fontWeight: 600 }}
            data-testid="vault-token"
          >
            {isLoading ? <SkeletonLine height={40} width={70} /> : resolvedSymbol}
          </Text>
          {selected && (
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: 'var(--earn-protocol-primary-40)',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon iconName="checkmark" size={12} />
            </div>
          )}
        </div>
        {value && <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>{value}</div>}
      </div>
      {!isVaultCard && networkName && networkWarnings[networkName]?.enabled ? (
        <Tooltip
          style={{
            margin: '0 10px',
          }}
          tooltipWrapperStyles={{
            marginTop: '20px',
          }}
          tooltip={
            networkWarnings[networkName].message ? (
              <Text variant="p4semi" style={{ whiteSpace: 'pre' }}>
                {networkWarnings[networkName].message}
              </Text>
            ) : undefined
          }
        >
          <Icon iconName="vault_network_warning" />
        </Tooltip>
      ) : null}
    </div>
  )
}
