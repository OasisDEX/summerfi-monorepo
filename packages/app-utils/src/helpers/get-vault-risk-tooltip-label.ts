import { type RiskType, type SDKVaultishType } from '@summerfi/app-types'

const riskTooltipLabels: {
  [key in RiskType]: string
} = {
  lower: 'Lower risk Vaults contain no exposure to peg or swap risk.',
  medium: '',
  higher:
    'Higher risk Vaults can contain exposure to peg or swap risk, plus higher exposure limits to individual markets. This can at times lead to lower instant liquidity.',
}

const daoManagedVaultTooltipLabel =
  'This Vault risk is managed by the DAO. By default it is set to higher risk, due to its potential exposure to peg or swap risk, but it can be adjusted by the DAO over time as needed.'

export const getVaultRiskTooltipLabel = ({
  vault,
  risk,
  isDaoManagedVault,
}: {
  vault?: SDKVaultishType
  risk?: RiskType
  isDaoManagedVault?: boolean
}): string => {
  return isDaoManagedVault
    ? daoManagedVaultTooltipLabel
    : riskTooltipLabels[risk ?? vault?.customFields?.risk ?? 'lower']
}
