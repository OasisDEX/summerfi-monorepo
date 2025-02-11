'use client'

import { type ReactNode } from 'react'
import { type DropdownOption, type DropdownRawOption } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import { Box } from '@/components/atoms/Box/Box'
import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import { TitleWithSelect } from '@/components/molecules/TitleWithSelect/TitleWithSelect'

import vaultGridStyles from './VaultGrid.module.scss'
import vaultManageGridStyles from '@/components/layout/VaultManageGrid/VaultManageGrid.module.scss'

type VaultGridProps = {
  topContent: ReactNode
  leftContent: ReactNode
  rightContent: ReactNode
  networksList: DropdownOption[]
  onChangeNetwork: (selected: DropdownRawOption) => void
  selectedNetwork?: DropdownOption
  isMobile?: boolean
}

export const VaultGrid = ({
  topContent,
  leftContent,
  rightContent,
  networksList,
  selectedNetwork,
  onChangeNetwork,
  isMobile,
}: VaultGridProps) => {
  return (
    <div className={vaultGridStyles.vaultGridWrapper}>
      <div className={vaultGridStyles.vaultGridHeaderWrapper}>
        <TitleWithSelect
          title="Earn"
          options={networksList}
          onChangeNetwork={onChangeNetwork}
          selected={selectedNetwork}
          tooltip={
            selectedNetwork && selectedNetwork.label !== 'All Networks'
              ? `You can deposit your assets into the strategies on ${capitalize(selectedNetwork.label)} network`
              : undefined
          }
        />
        <Link
          href="https://blog.summer.fi/say-hello-to-the-lazy-summer-protocol"
          style={{ display: 'block', width: 'min-content', whiteSpace: 'pre' }}
        >
          <Text as="p" variant="p3semi" style={{ display: 'inline' }}>
            <WithArrow style={{ display: 'inline' }}>What is the Lazy Summer Protocol</WithArrow>
          </Text>
        </Link>
      </div>
      <div className={vaultGridStyles.vaultGridPositionWrapper}>
        <Box className={vaultGridStyles.fullWidthBlock}>{topContent}</Box>
        <Box className={vaultGridStyles.leftBlock}>{leftContent}</Box>
        <div className={vaultGridStyles.rightBlockWrapper}>
          <div className={vaultGridStyles.rightBlock}>{rightContent}</div>
        </div>
      </div>
      {isMobile && <div className={vaultManageGridStyles.rightBlockMobile}>{rightContent}</div>}
    </div>
  )
}
