// used raw colors due to issues with Icon scss computed colors
import { type Risk } from '@summerfi/app-types'

export const riskColors: { [key in Risk]: string } = {
  high: 'rgba(255, 87, 57, 1)', // var(--earn-protocol-critical-100)'
  medium: 'rgba(249, 166, 1, 1)', // 'var(--earn-protocol-warning-100)'
  low: 'rgba(105, 223, 49, 1)', // 'var(--earn-protocol-success-100)'
}
