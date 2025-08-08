import { graphqlClients } from '@/arks-interest-rates/constants'

/**
 * Validates if a network is supported for interest rates queries.
 *
 * This function checks if the provided network string is a valid key
 * in the graphqlClients configuration, ensuring the network has
 * proper GraphQL client setup for interest rates data.
 *
 * @param {string} network - The network identifier to validate
 * @returns {network is keyof typeof graphqlClients} Type guard indicating if the network is supported
 *
 * @example
 * ```typescript
 * if (isProperInterestRatesNetwork(network)) {
 *   // Network is supported, proceed with interest rates query
 * }
 * ```
 */
export const isProperInterestRatesNetwork = (
  network: string,
): network is keyof typeof graphqlClients => network in graphqlClients
