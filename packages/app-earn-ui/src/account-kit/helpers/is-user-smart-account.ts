import { type UseUserResult } from '@account-kit/react'

import { AccountKitAccountType } from '@/account-kit/types'

/**
 * Checks if user has a smart contract account (SCA).
 * @param user - User object from AccountKit
 * @returns `true` if smart contract account, `false` otherwise
 */
export const isUserSmartAccount = (user: UseUserResult): boolean =>
  user?.type === AccountKitAccountType.SCA
