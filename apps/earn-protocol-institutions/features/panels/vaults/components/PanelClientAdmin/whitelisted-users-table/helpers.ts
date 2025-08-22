import { type VaultClientAdminUser } from '@/features/panels/vaults/components/PanelClientAdmin/types'

/**
 * Filters a list of VaultClientAdminUser objects by name or address.
 *
 * @param users - The array of VaultClientAdminUser objects to filter.
 * @param search - The search string to match against user name or address.
 * @returns The filtered array of users whose name or address includes the search string (case-insensitive).
 */
export const filterClientAdminUsers = (users: VaultClientAdminUser[], search: string) => {
  return users.filter((user) =>
    search
      ? user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.address.toLowerCase().includes(search.toLowerCase())
      : true,
  )
}
