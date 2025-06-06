import { Address } from '@summer_fi/sdk-client'

export const getWalletAddressHandler = (walletAddressString?: string) => () => {
  if (!walletAddressString) {
    throw new Error('walletAddress is not defined')
  }

  return Address.createFromEthereum({ value: walletAddressString })
}
