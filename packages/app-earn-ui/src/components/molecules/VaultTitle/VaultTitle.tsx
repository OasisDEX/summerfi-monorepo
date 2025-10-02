import { type FC, type ReactNode } from 'react'
import {
  type NetworkIds,
  type SDKVaultType,
  type SupportedSDKNetworks,
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

import vaultTitleStyles from './VaultTitle.module.css'

interface VaultTitleProps {
  symbol: SDKVaultType['inputToken']['symbol']
  networkId?: NetworkIds
  networkName?: SupportedSDKNetworks
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
    <div className={vaultTitleStyles.container}>
      <div className={vaultTitleStyles.iconContainer}>
        {isLoading ? (
          <SkeletonLine height={iconSize} width={iconSize} />
        ) : isIconDefined ? (
          /* if any icon breaks, this is probably because of TokenSymbolsList vs whatever comes from the subgraph */
          <Icon tokenName={resolvedSymbol as TokenSymbolsList} size={iconSize} />
        ) : (
          <GenericTokenIcon symbol={resolvedSymbol} customSize={32} />
        )}
        {(networkId ?? networkName) && (
          <div className={vaultTitleStyles.networkIcon} data-testid="vault-network">
            {networkId && networkIdIconNameMap[networkId] && (
              <Icon iconName={networkIdIconNameMap[networkId]} size={16} />
            )}
            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
            {networkName && networkNameIconNameMap[networkName] && (
              <Icon iconName={networkNameIconNameMap[networkName]} size={16} />
            )}
          </div>
        )}
      </div>

      <div className={vaultTitleStyles.textContainer}>
        <div className={vaultTitleStyles.titleRow}>
          <Text
            as="h4"
            variant={titleVariant}
            className={vaultTitleStyles.titleText}
            data-testid="vault-token"
          >
            {isLoading ? <SkeletonLine height={40} width={70} /> : resolvedSymbol}
          </Text>
          {selected && (
            <div className={vaultTitleStyles.selectedIndicator}>
              <Icon iconName="checkmark" size={12} />
            </div>
          )}
        </div>
        {value && <div className={vaultTitleStyles.valueContainer}>{value}</div>}
      </div>
      {!isVaultCard && networkName && networkWarnings[networkName]?.enabled ? (
        <Tooltip
          className={vaultTitleStyles.tooltip}
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
