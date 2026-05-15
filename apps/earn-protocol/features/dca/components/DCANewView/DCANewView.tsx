'use client'

import { type FC, useState } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'

import { DCAApprovalFlow } from '@/features/dca/components/DCAApprovalFlow/DCAApprovalFlow'
import { DCAPositionView } from '@/features/dca/components/DCAPositionView/DCAPositionView'
import { DCAWizard } from '@/features/dca/components/DCAWizard/DCAWizard'
import { buildMockPosition } from '@/features/dca/lib/mock-position'
import { type DCAConfig, type DCAPhase, type DCAResolvedPair } from '@/features/dca/lib/types'

import classNames from '@/features/dca/components/dca.module.css'

interface DCANewViewProps {
  sourceVaults: SDKVaultsListType
  targetVaults: SDKVaultsListType
  pairs: { fromVaultId: string; toVaultId: string }[]
}

export const DCANewView: FC<DCANewViewProps> = ({ sourceVaults, targetVaults, pairs }) => {
  const [phase, setPhase] = useState<DCAPhase>('wizard')
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [submitted, setSubmitted] = useState<{
    config: DCAConfig
    pair: DCAResolvedPair
  } | null>(null)

  return (
    <div className={classNames.pageWrapper}>
      {phase === 'wizard' ? (
        <DCAWizard sourceVaults={sourceVaults} targetVaults={targetVaults} pairs={pairs} />
      ) : null}

      {phase === 'approval' && submitted ? (
        <DCAApprovalFlow
          config={submitted.config}
          pair={submitted.pair}
          onComplete={() => setPhase('position')}
          onBack={() => setPhase('wizard')}
        />
      ) : null}

      {phase === 'position' && submitted ? (
        <>
          <Card variant="cardWarning">
            <Text as="p" variant="p3">
              Preview only — your strategy will be visible here once the on-chain creation flow is
              wired up.
            </Text>
          </Card>
          <DCAPositionView position={buildMockPosition('preview')} pair={submitted.pair} />
        </>
      ) : null}
    </div>
  )
}
