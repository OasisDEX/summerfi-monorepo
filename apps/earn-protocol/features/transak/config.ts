/* eslint no-console: off */
import { Transak, type TransakConfig } from '@transak/transak-sdk'

/**
 * Retrieves the Transak configuration.
 *
 * @param {Object} params - The parameters for the configuration.
 * @param {Partial<TransakConfig>} params.config - Partial configuration for Transak.
 * @returns {Transak} - The Transak instance with the provided configuration.
 * @throws {Error} If the environment variables for the Transak environment or API key are missing.
 */
export const getTransakConfig = ({ config }: { config: Partial<TransakConfig> }): Transak => {
  const environment = process.env.NEXT_PUBLIC_TRANSAK_ENVIRONMENT as
    | typeof Transak.ENVIRONMENTS.STAGING
    | typeof Transak.ENVIRONMENTS.PRODUCTION
    | undefined
  const apiKey = process.env.NEXT_PUBLIC_TRANSAK_API_KEY

  if (!apiKey || !environment) {
    throw new Error('Transak envs not defined')
  }

  const transakConfig: TransakConfig = {
    apiKey,
    environment,
    themeColor: 'FF49A4FF',
    containerId: 'transak-dialog',
  }

  return new Transak({ ...transakConfig, ...config })
}
