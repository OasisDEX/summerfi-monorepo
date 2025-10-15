import { type GlobalRoles } from '@summerfi/sdk-client'

import { getInstitutionRoles } from '@/app/server-handlers/sdk/get-institution-roles'

export const getWalletDetails: (props: {
  institutionName: string
  walletAddress?: string
}) => Promise<
  | {
      walletAddressRoles: GlobalRoles[]
      roles: {
        [key in GlobalRoles]: boolean
      }
    }
  | undefined
> = async ({ institutionName, walletAddress }) => {
  if (!walletAddress) {
    return undefined
  }
  try {
    const { ADMIRALS_QUARTERS_ROLE, DECAY_CONTROLLER_ROLE, GOVERNOR_ROLE, SUPER_KEEPER_ROLE } =
      await getInstitutionRoles({ institutionName })

    const normalizedWalletAddress = walletAddress.toLowerCase()
    const hasAdmiralsQuartersRole = ADMIRALS_QUARTERS_ROLE.wallets.some(
      (address) => address.toLowerCase() === normalizedWalletAddress,
    )
    const hasDecayControllerRole = DECAY_CONTROLLER_ROLE.wallets.some(
      (address) => address.toLowerCase() === normalizedWalletAddress,
    )
    const hasGovernorRole = GOVERNOR_ROLE.wallets.some(
      (address) => address.toLowerCase() === normalizedWalletAddress,
    )
    const hasSuperKeeperRole = SUPER_KEEPER_ROLE.wallets.some(
      (address) => address.toLowerCase() === normalizedWalletAddress,
    )

    const walletAddressRoles = [] as GlobalRoles[]

    if (hasAdmiralsQuartersRole) {
      walletAddressRoles.push('ADMIRALS_QUARTERS_ROLE' as GlobalRoles)
    }
    if (hasDecayControllerRole) {
      walletAddressRoles.push('DECAY_CONTROLLER_ROLE' as GlobalRoles)
    }
    if (hasGovernorRole) {
      walletAddressRoles.push('GOVERNOR_ROLE' as GlobalRoles)
    }
    if (hasSuperKeeperRole) {
      walletAddressRoles.push('SUPER_KEEPER_ROLE' as GlobalRoles)
    }

    return {
      walletAddressRoles,
      roles: {
        ADMIRALS_QUARTERS_ROLE: hasAdmiralsQuartersRole,
        DECAY_CONTROLLER_ROLE: hasDecayControllerRole,
        GOVERNOR_ROLE: hasGovernorRole,
        SUPER_KEEPER_ROLE: hasSuperKeeperRole,
      },
    }
  } catch (error) {
    return undefined
  }
}
