import { SDKChainId, SDKNetwork, type SDKSupportedNetwork } from '@summerfi/app-types'

/**
 * Generates URL for fetching historical rates from Arks API based on network
 * @param {Object} params - The parameters object
 * @param {SDKSupportedNetwork} params.network - The blockchain network
 * @param {string} params.apiUrl - Base API URL
 * @returns {string} The complete historical rates API URL
 */
export const getArkHistoricalRatesUrl = ({
  network,
  apiUrl,
}: {
  network: SDKSupportedNetwork
  apiUrl: string
}) =>
  ({
    [SDKNetwork.Mainnet]: `${apiUrl}/api/historicalRates/${SDKChainId.MAINNET}`,
    [SDKNetwork.Base]: `${apiUrl}/api/historicalRates/${SDKChainId.BASE}`,
    [SDKNetwork.ArbitrumOne]: `${apiUrl}/api/historicalRates/${SDKChainId.ARBITRUM}`,
  })[network]

/**
 * Generates URL for fetching current rates from Arks API based on network
 * @param {Object} params - The parameters object
 * @param {SDKSupportedNetwork} params.network - The blockchain network
 * @param {string} params.apiUrl - Base API URL
 * @returns {string} The complete current rates API URL
 */
export const getArkRatesUrl = ({
  network,
  apiUrl,
}: {
  network: SDKSupportedNetwork
  apiUrl: string
}) =>
  ({
    [SDKNetwork.Mainnet]: `${apiUrl}/api/rates/${SDKChainId.MAINNET}`,
    [SDKNetwork.Base]: `${apiUrl}/api/rates/${SDKChainId.BASE}`,
    [SDKNetwork.ArbitrumOne]: `${apiUrl}/api/rates/${SDKChainId.ARBITRUM}`,
  })[network]
