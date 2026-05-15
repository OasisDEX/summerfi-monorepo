export const formatUSD = (
  value: number | undefined | null,
  opts: { decimals?: number; sign?: boolean } = {},
): string => {
  const { decimals = 2, sign = false } = opts

  if (value === undefined || value === null || Number.isNaN(value)) return '—'

  const abs = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  const prefix = sign ? (value >= 0 ? '+' : '−') : value < 0 ? '−' : ''

  return `${prefix}$${abs}`
}

export const formatNumber = (value: number | undefined | null, decimals = 4): string => {
  if (value === undefined || value === null || Number.isNaN(value)) return '—'

  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export const formatPercent = (
  value: number | undefined | null,
  decimals = 2,
  sign = false,
): string => {
  if (value === undefined || value === null || Number.isNaN(value)) return '—'

  const prefix = sign ? (value >= 0 ? '+' : '−') : ''

  return `${prefix}${Math.abs(value).toFixed(decimals)}%`
}
