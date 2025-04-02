import { type SDKVaultishType } from '@summerfi/app-types'
import dayjs from 'dayjs'

/**
 * Checks if a vault has been created at least a specified number of days ago.
 *
 * @param vault - The vault object to check the age of
 * @param days - The minimum number of days the vault should be old
 * @returns True if the vault is older than the specified number of days, false otherwise
 */
export const isVaultAtLeastDaysOld = ({
  vault,
  days,
}: {
  vault: SDKVaultishType
  days: number
}): boolean => {
  return vault.createdTimestamp
    ? dayjs().diff(dayjs(Number(vault.createdTimestamp) * 1000), 'day') > days
    : false
}
