import { useAccount, useChain, useUser } from '@account-kit/react'

import { getAccountType } from '@/account-kit/constants'

/**
 * Custom hook to get the user's wallet address.
 *
 * This hook uses the `useUser` and `useAccount` hooks from `@account-kit/react`
 * to retrieve the user's wallet address. It first tries to get the address from
 * the `account` object which provides address for Smart Account, and if that is not available,
 * it falls back to the `user` object which is valid for EOA wallets
 *
 * @returns {string | undefined} The user's wallet address, or `undefined` if not available.
 */
export const useUserWallet = (): {
  userWalletAddress: string | undefined
  isLoadingAccount: boolean
} => {
  const user = useUser()
  const { chain } = useChain()
  const { account, isLoadingAccount } = useAccount({ type: getAccountType(chain.id) })

  // user loads first and if sca we need to wait for account to be defined
  // to avoid ui flickering
  if (user?.type === 'sca' && !account?.address) {
    return { userWalletAddress: undefined, isLoadingAccount }
  }

  return { userWalletAddress: account?.address ?? user?.address, isLoadingAccount }
}
