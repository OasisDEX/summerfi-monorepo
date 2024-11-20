import {
  transakEnvironment,
  transakProductionUrl,
  transakPublicApiKey,
  transakStagingUrl,
} from '@/features/transak/consts'

export const getTransakUrl = () => {
  if (transakEnvironment && transakPublicApiKey) {
    return transakEnvironment === 'STAGING' ? transakStagingUrl : transakProductionUrl
  }

  throw new Error('Transak env variables not defined')
}
