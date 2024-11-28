import { transakPublicApiKey } from '@/features/transak/consts'
import { getTransakUrl } from '@/features/transak/helpers/get-transak-url'
import {
  type TransakAction,
  type TransakPaymentOptions,
  type TransakSupportedNetworksNames,
} from '@/features/transak/types'

/**
 * Generates the Transak pricing URL based on the provided parameters.
 *
 * @param {Object} params - The parameters for generating the pricing URL.
 * @param {string} params.fiatCurrency - The fiat currency code.
 * @param {string} params.cryptoCurrency - The cryptocurrency code.
 * @param {TransakAction} params.isBuyOrSell - The action type (buy or sell).
 * @param {TransakSupportedNetworksNames} params.network - The blockchain network.
 * @param {TransakPaymentOptions} params.paymentMethod - The payment method.
 * @param {string} params.fiatAmount - The amount in fiat currency.
 * @param {string | undefined} params.ipCountryCode - The IP country code (optional).
 * @returns {string} - The generated Transak pricing URL.
 */
export const getTransakPricingUrl = ({
  fiatCurrency,
  cryptoCurrency,
  isBuyOrSell,
  network,
  paymentMethod,
  fiatAmount,
  ipCountryCode,
}: {
  fiatCurrency: string
  cryptoCurrency: string
  isBuyOrSell: TransakAction
  network: TransakSupportedNetworksNames
  paymentMethod: TransakPaymentOptions
  fiatAmount: string
  ipCountryCode: string | undefined
}): string => {
  if (!transakPublicApiKey) {
    throw new Error('ENV variable missing')
  }

  return `${getTransakUrl()}/api/v1/pricing/public/quotes?${new URLSearchParams({
    partnerApiKey: transakPublicApiKey,
    fiatCurrency,
    cryptoCurrency,
    isBuyOrSell,
    network,
    paymentMethod,
    fiatAmount,
    // this param is optional, but when defined
    // exchange details will be more precise
    quoteCountryCode: ipCountryCode ?? '',
  }).toString()}`
}
