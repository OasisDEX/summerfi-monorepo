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

// To get all the events
Transak.on('*', (data) => {
  console.log('Transak events', data)
})

// This will trigger when the user closed the widget
Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
  console.log('Transak SDK closed!')
})

/*
 * This will trigger when the user has confirmed the order
 * This doesn't guarantee that payment has completed in all scenarios
 * If you want to close/navigate away, use the TRANSAK_ORDER_SUCCESSFUL event
 */
Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
  console.log(orderData)
})

/*
 * This will trigger when the user marks payment is made
 * You can close/navigate away at this event
 */
// Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
//   console.log(orderData)
//   transak.close()
// })
