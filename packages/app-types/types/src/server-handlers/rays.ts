export interface RaysApiResponse {
  address: string
  eligiblePoints: number
  allPossiblePoints: number
  actionRequiredPoints: unknown[]
  positionInLeaderboard: string
  userTypes: ('General Ethereum User' | 'DeFi User' | 'SummerFi User' | 'SummerFi Power User')[]
}
