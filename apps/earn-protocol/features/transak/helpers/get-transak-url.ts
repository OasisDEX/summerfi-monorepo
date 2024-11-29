import {
  transakEnvironment,
  transakProductionUrl,
  transakPublicApiKey,
  transakStagingUrl,
} from '@/features/transak/consts'

/**
 * Returns the Transak URL based on the environment and API key.
 *
 * @returns {string} - The Transak URL.
 * @throws {Error} If the environment variables for the Transak environment or public API key are missing.
 */
export const getTransakUrl = (): string => {
  if (transakEnvironment && transakPublicApiKey) {
    return transakEnvironment === 'STAGING' ? transakStagingUrl : transakProductionUrl
  }

  throw new Error('Transak env variables not defined')
}
