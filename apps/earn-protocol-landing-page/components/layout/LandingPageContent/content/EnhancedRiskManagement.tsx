import { Text } from '@summerfi/app-earn-ui'

import { BigGradientBox } from '@/components/layout/LandingPageContent'

import enhancedRiskManagementStyles from '@/components/layout/LandingPageContent/content/EnhancedRiskManagement.module.scss'

export const EnhancedRiskManagement = () => {
  return (
    <div>
      <div className={enhancedRiskManagementStyles.enhancedRiskManagementHeaderWrapper}>
        <Text variant="h2" className={enhancedRiskManagementStyles.enhancedRiskManagementHeader}>
          Enhanced risk management with time-saving automation.
        </Text>
      </div>
      <BigGradientBox reversed>
        <br />
        <br />
      </BigGradientBox>
    </div>
  )
}
