import { type RiskType, type SDKVaultishType } from '@summerfi/app-types'

const riskTooltipLabels: {
  [key in RiskType]: string
} = {
  lower: 'Lower risk Vaults contain no exposure to peg or swap risk.',
  medium: '',
  higher:
    'Higher risk Vaults can contain exposure to peg or swap risk, plus higher exposure limits to individual markets. This can at times lead to lower instant liquidity.',
}

export const getVaultRiskTooltipLabel = ({
  vault,
  risk,
}: {
  vault?: SDKVaultishType
  risk?: RiskType
}): string => {
  return riskTooltipLabels[risk ?? vault?.customFields?.risk ?? 'lower']
}
