export type TimeframesType = '7d' | '30d' | '90d' | '6m' | '1y' | '3y'
export type TimeframesItem = {
  [key in TimeframesType]: boolean
}
