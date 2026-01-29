import {
  transakEnvironment,
  transakGatewayProductionUrl,
  transakGatewayStagingUrl,
} from '@/features/transak/consts'

/**
 * Returns the Transak API gateway URL based on the environment.
 *
 * @returns {string} - The Transak API gateway URL.
 * @throws {Error} If the environment variable for the Transak environment is missing.
 */
export const getTransakGatewayUrl = (): string => {
  if (transakEnvironment) {
    return transakEnvironment === 'STAGING' ? transakGatewayStagingUrl : transakGatewayProductionUrl
  }

  throw new Error('Transak env variables not defined')
}
