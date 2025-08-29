'use client'

import { type ReactNode, useState } from 'react'
import Link from 'next/link'

import { Box } from '@/components/atoms/Box/Box'
import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import { TitleWithSelect } from '@/components/molecules/TitleWithSelect/TitleWithSelect'

import vaultGridStyles from './VaultGrid.module.css'
import vaultManageGridStyles from '@/components/layout/VaultManageGrid/VaultManageGrid.module.css'

type VaultGridProps = {
  topContent: ReactNode
  leftContent: ReactNode
  rightContent: ReactNode
  isMobileOrTablet?: boolean
  onRefresh?: () => void
  onWhatIsLazyClick?: () => void
}

export const VaultGrid = ({
  topContent,
  leftContent,
  rightContent,
  isMobileOrTablet,
  onRefresh,
  onWhatIsLazyClick,
}: VaultGridProps): React.ReactNode => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleUserRefresh = () => {
    onRefresh?.()
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 5000)
  }

  return (
    <div className={vaultGridStyles.vaultGridWrapper}>
      <div className={vaultGridStyles.vaultGridHeaderWrapper}>
        <TitleWithSelect title="Earn" onRefresh={handleUserRefresh} isRefreshing={isRefreshing} />
        <Link
          href="https://blog.summer.fi/say-hello-to-the-lazy-summer-protocol"
          style={{ display: 'block', width: 'min-content', whiteSpace: 'pre' }}
          target="_blank"
          onClick={onWhatIsLazyClick}
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
      {isMobileOrTablet && (
        <div className={vaultManageGridStyles.rightBlockMobile}>{rightContent}</div>
      )}
    </div>
  )
}
