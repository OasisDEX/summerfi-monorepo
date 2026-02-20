import type { CSSProperties, FC } from 'react'
import { type SDKVaultishType, type TokenSymbolsList } from '@summerfi/app-types'
import { supportedSDKNetwork } from '@summerfi/app-utils'
import clsx from 'clsx'
import Link from 'next/link'

import { DaoManagedPill } from '@/components/atoms/DaoManagedPill/DaoManagedPill'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Risk } from '@/components/atoms/Risk/Risk'
import { Text } from '@/components/atoms/Text/Text'
import { networkNameIconNameMap } from '@/constants/icon-maps'
import { getDisplayToken } from '@/helpers/get-display-token'
import { riskColors } from '@/helpers/risk-colors'

import classNames from './VaultTitleDropdownContent.module.css'

interface VaultDropdownContentProps {
  vault: SDKVaultishType
  isDisabled?: boolean
  style?: CSSProperties
  link?: string
  className?: string
  linkOnClick?: () => void
  customVaultName?: string
  isDaoManaged?: boolean
}

export const VaultTitleDropdownContentBlock: FC<Omit<VaultDropdownContentProps, 'link'>> = ({
  vault,
  isDisabled,
  style,
  className,
  customVaultName,
  isDaoManaged,
}) => {
  const resolvedRisk = isDaoManaged ? 'higher' : vault.customFields?.risk ?? 'lower'
  const color = riskColors[resolvedRisk]

  return (
    <div
      className={clsx(classNames.wrapper, className)}
      style={{
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      <div className={classNames.iconWithSymbolWrapper}>
        <Icon
          tokenName={getDisplayToken(vault.inputToken.symbol) as TokenSymbolsList}
          variant="m"
        />
        <div className={classNames.networkIconWrapper}>
          <Icon
            iconName={networkNameIconNameMap[supportedSDKNetwork(vault.protocol.network)]}
            size={10}
          />
        </div>
        <Text
          as="p"
          variant="p1semi"
          className={customVaultName ? classNames.customVaultTitle : ''}
        >
          {customVaultName ?? getDisplayToken(vault.inputToken.symbol)}
        </Text>
      </div>
      {isDaoManaged ? <DaoManagedPill riskColor={color} small /> : null}
      <Risk risk={resolvedRisk} variant="p4semi" />
    </div>
  )
}

export const VaultTitleDropdownContent: FC<VaultDropdownContentProps> = ({
  vault,
  link,
  linkOnClick,
  isDisabled,
  style = {},
  className,
  isDaoManaged,
}) => {
  return link ? (
    <Link href={link} onClick={linkOnClick}>
      <VaultTitleDropdownContentBlock
        vault={vault}
        isDisabled={isDisabled}
        style={style}
        className={className}
        isDaoManaged={isDaoManaged}
      />
    </Link>
  ) : (
    <VaultTitleDropdownContentBlock
      vault={vault}
      isDisabled={isDisabled}
      style={style}
      className={className}
      isDaoManaged={isDaoManaged}
    />
  )
}
