import { type UseUserResult } from '@account-kit/react'

import { AccountKitAccountType } from '@/account-kit/types'

/**
 * Checks if user has an externally owned account (EOA).
 * @param user - User object from AccountKit
 * @returns `true` if EOA, `false` otherwise
 */
export const isUserEOA = (user: UseUserResult): boolean => user?.type === AccountKitAccountType.EOA
