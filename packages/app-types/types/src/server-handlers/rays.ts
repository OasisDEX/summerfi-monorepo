import { EligibilityCondition } from '@summerfi/serverless-shared'

export interface RaysApiResponse {
  address: string
  eligiblePoints: number
  allPossiblePoints: number
  actionRequiredPoints: {
    dueDate: string
    points: number
    type: EligibilityCondition
  }[]
  positionInLeaderboard: string
  userTypes: ('General Ethereum User' | 'DeFi User' | 'SummerFi User' | 'SummerFi Power User')[]
}
