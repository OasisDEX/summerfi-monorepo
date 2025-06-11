import { OkxQuestResult } from './campaigns/okx/types'

export interface CampaignResponse {
  code: number
  data: boolean
  debug?: {
    walletAddress: string
    questResults: OkxQuestResult[]
    allCompleted: boolean
    [key: string]: unknown
  }
}
