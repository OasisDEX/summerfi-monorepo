import { SupportedNetworkIds, SupportedSDKNetworks } from '@summerfi/app-types'

/**
 * Generates URL for fetching historical rates from Arks API based on network
 * @param {Object} params - The parameters object
 * @param {SupportedSDKNetworks} params.network - The blockchain network
 * @param {string} params.apiUrl - Base API URL
 * @returns {string} The complete historical rates API URL
 */
export const getArkHistoricalRatesUrl = ({
  network,
  apiUrl,
}: {
  network: SupportedSDKNetworks
  apiUrl: string
}): string =>
  ({
    [SupportedSDKNetworks.Mainnet]: `${apiUrl}/api/historicalRates/${SupportedNetworkIds.Mainnet}`,
    [SupportedSDKNetworks.Base]: `${apiUrl}/api/historicalRates/${SupportedNetworkIds.Base}`,
    [SupportedSDKNetworks.ArbitrumOne]: `${apiUrl}/api/historicalRates/${SupportedNetworkIds.ArbitrumOne}`,
    [SupportedSDKNetworks.SonicMainnet]: `${apiUrl}/api/historicalRates/${SupportedNetworkIds.SonicMainnet}`,
    [SupportedSDKNetworks.Hyperliquid]: `${apiUrl}/api/historicalRates/${SupportedNetworkIds.Hyperliquid}`,
  })[network]

/**
 * Generates URL for fetching current rates from Arks API based on network
 * @param {Object} params - The parameters object
 * @param {SupportedSDKNetworks} params.network - The blockchain network
 * @param {string} params.apiUrl - Base API URL
 * @returns {string} The complete current rates API URL
 */
export const getArkRatesUrl = ({
  network,
  apiUrl,
}: {
  network: SupportedSDKNetworks
  apiUrl: string
}): string =>
  ({
    [SupportedSDKNetworks.Mainnet]: `${apiUrl}/api/rates/${SupportedNetworkIds.Mainnet}`,
    [SupportedSDKNetworks.Base]: `${apiUrl}/api/rates/${SupportedNetworkIds.Base}`,
    [SupportedSDKNetworks.ArbitrumOne]: `${apiUrl}/api/rates/${SupportedNetworkIds.ArbitrumOne}`,
    [SupportedSDKNetworks.SonicMainnet]: `${apiUrl}/api/rates/${SupportedNetworkIds.SonicMainnet}`,
    [SupportedSDKNetworks.Hyperliquid]: `${apiUrl}/api/rates/${SupportedNetworkIds.Hyperliquid}`,
  })[network]

/**
 * Generates URL for fetching current rates from Arks API based on network
 * @param {Object} params - The parameters object
 * @param {string} params.apiUrl - Base API URL
 * @returns {string} The complete current rates API URL
 */
export const getArkRatesBatchUrl = ({ apiUrl }: { apiUrl: string }) => `${apiUrl}/api/rates`
