import { type GeneralRoles } from '@summerfi/sdk-client'

import { getInstitutionRoles } from '@/app/server-handlers/sdk/get-institution-roles'

export const getWalletDetails: (props: {
  institutionName: string
  walletAddress?: string
}) => Promise<
  | {
      walletAddressRoles: GeneralRoles[]
      roles: {
        [key in GeneralRoles]: boolean
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

    const hasAdmiralsQuartersRole = ADMIRALS_QUARTERS_ROLE.wallets.includes(walletAddress)
    const hasDecayControllerRole = DECAY_CONTROLLER_ROLE.wallets.includes(walletAddress)
    const hasGovernorRole = GOVERNOR_ROLE.wallets.includes(walletAddress)
    const hasSuperKeeperRole = SUPER_KEEPER_ROLE.wallets.includes(walletAddress)

    const walletAddressRoles = [] as GeneralRoles[]

    if (hasAdmiralsQuartersRole) {
      walletAddressRoles.push('ADMIRALS_QUARTERS_ROLE' as GeneralRoles)
    }
    if (hasDecayControllerRole) {
      walletAddressRoles.push('DECAY_CONTROLLER_ROLE' as GeneralRoles)
    }
    if (hasGovernorRole) {
      walletAddressRoles.push('GOVERNOR_ROLE' as GeneralRoles)
    }
    if (hasSuperKeeperRole) {
      walletAddressRoles.push('SUPER_KEEPER_ROLE' as GeneralRoles)
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
