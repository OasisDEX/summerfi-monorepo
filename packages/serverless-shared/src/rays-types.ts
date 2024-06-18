export enum EligibilityCondition {
  POSITION_OPEN_TIME = 'POSITION_OPEN_TIME',
  POINTS_EXPIRED = 'POINTS_EXPIRED',
  BECOME_SUMMER_USER = 'BECOME_SUMMER_USER',
}

export type RaysUserResponse = {
  address: string
  eligiblePoints: number
  allPossiblePoints: number
  actionRequiredPoints: { dueDate: string; points: number; type: EligibilityCondition }[]
  positionInLeaderboard: string
  userTypes: ('General Ethereum User' | 'DeFi User' | 'SummerFi User' | 'SummerFi Power User')[]
}
