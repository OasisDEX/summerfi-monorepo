import { TransakSteps } from '@/features/transak/types'

export const transakStagingUrl = 'https://api-stg.transak.com'
export const transakProductionUrl = 'https://api.transak.com'

export const transakEnvironment = process.env.NEXT_PUBLIC_TRANSAK_ENVIRONMENT
export const transakPublicApiKey = process.env.NEXT_PUBLIC_TRANSAK_API_KEY

export const transakSteps = [
  TransakSteps.INITIAL,
  TransakSteps.ABOUT_KYC,
  TransakSteps.EXCHANGE,
  TransakSteps.KYC,
]
