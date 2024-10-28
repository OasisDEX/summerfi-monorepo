'use client'
import { type FC, useEffect, useState } from 'react'
import { Card, InlineButtons, Text, useHash } from '@summerfi/app-earn-ui'
import { type InlineButtonOption } from '@summerfi/app-types'

import { VaultDetailsAdvancedYield } from '@/features/vault-details/components/VaultDetailsAdvancedYield/VaultDetailsAdvancedYield'
import {
  vaultDetailsYieldOptions,
  YieldOption,
} from '@/features/vault-details/components/VaultDetailsYields/config'
import { VaultDetailsYieldSources } from '@/features/vault-details/components/VaultDetailsYieldSources/VaultDetailsYieldSources'

export const VaultDetailsYields: FC = () => {
  const hash = useHash<YieldOption>()

  const [currentYieldOption, setCurrentYieldOption] = useState<InlineButtonOption<string>>(
    vaultDetailsYieldOptions[0],
  )

  useEffect(() => {
    setCurrentYieldOption(
      vaultDetailsYieldOptions.find((item) => item.key === hash) ?? vaultDetailsYieldOptions[0],
    )
  }, [hash])

  return (
    <Card variant="cardPrimary">
      <div id="advanced-yield-data" />
      <div id="yield-sources" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <InlineButtons
          options={vaultDetailsYieldOptions}
          currentOption={currentYieldOption}
          handleOption={(option) => setCurrentYieldOption(option)}
          style={{
            marginBottom: 'var(--spacing-space-large)',
          }}
          asUnstyled
          variant="h5"
        />
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--spacing-space-x-large)',
            color: 'var(--earn-protocol-secondary-60)',
          }}
        >
          The Summer Earn Protocol is a permissionless passive lending product, which sets out to
          offer effortless and secure optimised yield, while diversifying risk.
        </Text>
        {currentYieldOption.key === YieldOption.ADVANCED_YIELD && <VaultDetailsAdvancedYield />}
        {currentYieldOption.key === YieldOption.YIELD_SOURCES && <VaultDetailsYieldSources />}
      </div>
    </Card>
  )
}
