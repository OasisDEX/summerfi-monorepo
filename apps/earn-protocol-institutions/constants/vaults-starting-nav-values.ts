/*
  A list of 'starting' NAV values for each vault. It's hard to know the exact date
  of 'being live', so we have to keep this list updated manually.

  The list is vault id/chain => starting NAV value.
*/

import { type NetworkIds } from '@summerfi/app-types'

export const VAULTS_STARTING_NAV_VALUES: { [key: `${string}-${NetworkIds}`]: number } = {
  '0x6e23cfe8d830488bc824c0add201a1a2e1dfdbeb-42161': 0.9993, // USDC Arbitrum TarFi
}
