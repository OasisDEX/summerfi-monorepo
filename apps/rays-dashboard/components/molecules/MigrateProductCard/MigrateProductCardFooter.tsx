import { AutomationIcon, Button, Text } from '@summerfi/app-ui'
import { IconArrowRight } from '@tabler/icons-react'

import migrateProductCardStyles from '@/components/molecules/MigrateProductCard/MigrateProductCard.module.css'

export const MigrateProductCardFooter = ({ action }: { action: () => void }) => (
  <div className={migrateProductCardStyles.footer}>
    <div className={migrateProductCardStyles.footerAutomations}>
      <Text variant="p4semi" className={migrateProductCardStyles.heading}>
        Available Upon Migration
      </Text>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          columnGap: 'var(--space-xs)',
          marginTop: 'var(--space-xs)',
        }}
      >
        <AutomationIcon type="stopLoss" tooltip="Stop Loss" variant="s" />
        <AutomationIcon type="autoBuy" tooltip="Auto Buy" variant="s" />
        <AutomationIcon type="autoSell" tooltip="Auto Sell" variant="s" />
        <AutomationIcon type="partialTakeProfit" tooltip="Partial Take Profit" variant="s" />
      </div>
    </div>
    {/*
     * Migration link should have following format:
     * [networkOrProduct]/aave/[version]/migrate/[address]
     */}
    <Button variant="secondarySmall" onClick={action}>
      Migrate <IconArrowRight size={14} />
    </Button>
  </div>
)
