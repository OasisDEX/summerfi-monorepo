/* eslint no-console: off */
import { Transak, type TransakConfig } from '@transak/transak-sdk'

export const getTransakConfig = ({ config }: { config: Partial<TransakConfig> }) => {
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
    disableWalletAddressForm: true,
  }

  return new Transak({ ...transakConfig, ...config })
}
