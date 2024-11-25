import {
  TransakOrderDataStatus,
  TransakPaymentOptions,
  TransakSteps,
} from '@/features/transak/types'

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

export const transakPaymentMethods = [
  {
    id: TransakPaymentOptions.CREDIT_DEBIT_CARD,
    processingTime: '1-3 minutes',
  },
  {
    id: TransakPaymentOptions.APPLE_PAY,
    processingTime: '1-4 minutes',
  },
  {
    id: TransakPaymentOptions.GOOGLE_PAY,
    processingTime: '1-4 minutes',
  },
  {
    id: TransakPaymentOptions.GBP_BANK_TRANSFER,
    processingTime: '1-3 minutes',
  },
  {
    id: TransakPaymentOptions.PM_OPEN_BANKING,
    processingTime: '1-3 minutes',
  },
  {
    id: TransakPaymentOptions.INR_BANK_TRANSFER,
    processingTime: '4-6 hours',
  },
  {
    id: TransakPaymentOptions.INR_UPI,
    processingTime: '2-5 minutes',
  },
  {
    id: TransakPaymentOptions.SEPA_BANK_TRANSFER,
    processingTime: '1 to 2 days',
  },
  {
    id: TransakPaymentOptions.PM_ASTROPAY,
    processingTime: '1-3 minutes',
  },
  {
    id: TransakPaymentOptions.PM_GCASH,
    processingTime: '1-3 minutes',
  },
  {
    id: TransakPaymentOptions.PM_PAYMAYA,
    processingTime: '1-3 minutes',
  },
  {
    id: TransakPaymentOptions.PM_BPI,
    processingTime: '1-3 minutes',
  },
  {
    id: TransakPaymentOptions.PM_UBP,
    processingTime: '1-3 minutes',
  },
  {
    id: TransakPaymentOptions.PM_GRABPAY,
    processingTime: '1-3 minutes',
  },
  {
    id: TransakPaymentOptions.PM_SHOPEEPAY,
    processingTime: '1-3 minutes',
  },
  {
    id: TransakPaymentOptions.PM_PSE,
    processingTime: '1-3 minutes',
  },
]

export const transakFailedOrderStatuses = [
  TransakOrderDataStatus.FAILED,
  TransakOrderDataStatus.CANCELED,
  TransakOrderDataStatus.EXPIRED,
]
