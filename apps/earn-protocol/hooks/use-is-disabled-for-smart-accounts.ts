import { useChain, useUser } from '@account-kit/react'
import { isUserSmartAccount } from '@summerfi/app-earn-ui'
import { NetworkIds } from '@summerfi/app-types'

export const useIsDisabledForSmartAccounts = () => {
  const userAAKit = useUser()
  const userIsSmartAccount = isUserSmartAccount(userAAKit)
  const { chain } = useChain()

  const smartAccountNotSupportedChains = [NetworkIds.HYPERLIQUID, NetworkIds.SONICMAINNET]

  return userIsSmartAccount ? smartAccountNotSupportedChains.includes(chain.id) : false
}
