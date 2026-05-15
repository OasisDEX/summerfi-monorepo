import { type FC } from 'react'
import { Card, Input, Text } from '@summerfi/app-earn-ui'

import { DCAWizardStepCard } from '@/features/dca/components/DCAWizard/DCAWizardStepCard'
import { type DCAConfig } from '@/features/dca/lib/types'

import classNames from '@/features/dca/components/dca.module.css'

interface StepAdvancedConfigProps {
  config: DCAConfig
  sourceSymbol: string
  targetSymbol: string
  patchConfig: (patch: Partial<DCAConfig>) => void
}

export const StepAdvancedConfig: FC<StepAdvancedConfigProps> = ({
  config,
  sourceSymbol,
  targetSymbol,
  patchConfig,
}) => {
  const conditions = [
    {
      title: 'Total budget',
      description: `Stop the strategy once you've spent this much ${sourceSymbol} in total.`,
      enabled: config.budget > 0,
      onToggle: () => patchConfig({ budget: config.budget > 0 ? 0 : config.amount * 30 }),
      value: config.budget,
      onChange: (value: number) => patchConfig({ budget: value }),
    },
    {
      title: 'Price ceiling',
      description: `Skip executions when ${targetSymbol} trades above this price.`,
      enabled: config.priceCeiling > 0,
      onToggle: () => patchConfig({ priceCeiling: config.priceCeiling > 0 ? 0 : 3500 }),
      value: config.priceCeiling,
      onChange: (value: number) => patchConfig({ priceCeiling: value }),
    },
    {
      title: `Stop at ${targetSymbol} amount`,
      description: `Stop the strategy once you've accumulated this much ${targetSymbol}.`,
      enabled: config.stopAtTarget > 0,
      onToggle: () => patchConfig({ stopAtTarget: config.stopAtTarget > 0 ? 0 : 1 }),
      value: config.stopAtTarget,
      onChange: (value: number) => patchConfig({ stopAtTarget: value }),
    },
  ]

  return (
    <DCAWizardStepCard title="Step 4 - Advanced configuration">
      <div className={classNames.conditionsStack}>
        {conditions.map((condition) => (
          <Card key={condition.title} variant="cardSecondary">
            <div className={classNames.conditionCardContent}>
              <div className={classNames.conditionHeader}>
                <div>
                  <Text as="h4" variant="p1semi">
                    {condition.title}
                  </Text>
                  <Text as="p" variant="p3" className={classNames.mutedText}>
                    {condition.description}
                  </Text>
                </div>
                <button
                  type="button"
                  onClick={condition.onToggle}
                  className={`${classNames.toggle} ${
                    condition.enabled ? classNames.toggleActive : ''
                  }`}
                  aria-pressed={condition.enabled}
                >
                  <span
                    className={`${classNames.toggleHandle} ${
                      condition.enabled ? classNames.toggleHandleActive : ''
                    }`}
                  />
                </button>
              </div>
              {condition.enabled ? (
                <Input
                  variant="dark"
                  type="number"
                  min={0}
                  step="any"
                  value={condition.value || ''}
                  onChange={(ev) => condition.onChange(Number(ev.target.value))}
                />
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </DCAWizardStepCard>
  )
}
