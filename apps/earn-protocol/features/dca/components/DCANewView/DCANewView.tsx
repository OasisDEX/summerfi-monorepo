'use client'

import { type FC, useState } from 'react'
import { type SDKVaultsListType } from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'
import { DCAApprovalFlow } from '@/features/dca/components/DCAApprovalFlow/DCAApprovalFlow'
import { DCAWizard } from '@/features/dca/components/DCAWizard/DCAWizard'
import { type DCAConfig, type DCAPhase, type DCAResolvedPair } from '@/features/dca/lib/types'

import classNames from '@/features/dca/components/dca.module.css'

interface DCANewViewProps {
  sourceVaults: SDKVaultsListType
  targetVaults: SDKVaultsListType
  pairs: { fromVaultId: string; toVaultId: string }[]
}

export const DCANewView: FC<DCANewViewProps> = ({ sourceVaults, targetVaults, pairs }) => {
  const [phase, setPhase] = useState<DCAPhase>('wizard')
  const [submitted, setSubmitted] = useState<{
    config: DCAConfig
    pair: DCAResolvedPair
  } | null>(null)

  return (
    <div className={classNames.pageWrapper}>
      {phase === 'wizard' ? (
        <DCAWizard
          sourceVaults={sourceVaults}
          targetVaults={targetVaults}
          pairs={pairs}
          config={submitted?.config}
          pair={submitted?.pair}
          onSubmit={(config, pair) => {
            setSubmitted({ config, pair })
            setPhase('approval')
          }}
        />
      ) : null}

      {phase === 'approval' && submitted ? (
        <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
          <DCAApprovalFlow
            config={submitted.config}
            pair={submitted.pair}
            onBack={() => setPhase('wizard')}
          />
        </SDKContextProvider>
      ) : null}
    </div>
  )
}
