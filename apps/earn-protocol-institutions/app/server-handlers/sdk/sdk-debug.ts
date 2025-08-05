import { NetworkIds } from '@summerfi/app-types'
import { GeneralRoles } from '@summerfi/sdk-client'
import { Address } from '@summerfi/sdk-common'

import { getInstitutionsSDK } from '@/app/server-handlers/sdk'

export const sdkDebug = async (institutionID: string) => {
  const institutionSDK = getInstitutionsSDK(institutionID)

  const dummyAddress = Address.createFromEthereum({
    value: '0x0000000000000000000000000000000000000000',
  })
  // eslint-disable-next-line camelcase
  const [debugAQ, debugDC, debugG, debugSK, debugGrantGeneralRoleTX_DO_NOT_EXECUTE] =
    await Promise.all([
      institutionSDK.armada.accessControl.getAllAddressesWithGeneralRole({
        chainId: NetworkIds.BASEMAINNET, // Base
        role: GeneralRoles.ADMIRALS_QUARTERS_ROLE,
      }),
      institutionSDK.armada.accessControl.getAllAddressesWithGeneralRole({
        chainId: NetworkIds.BASEMAINNET, // Base
        role: GeneralRoles.DECAY_CONTROLLER_ROLE,
      }),
      institutionSDK.armada.accessControl.getAllAddressesWithGeneralRole({
        chainId: NetworkIds.BASEMAINNET, // Base
        role: GeneralRoles.GOVERNOR_ROLE,
      }),
      institutionSDK.armada.accessControl.getAllAddressesWithGeneralRole({
        chainId: NetworkIds.BASEMAINNET, // Base
        role: GeneralRoles.SUPER_KEEPER_ROLE,
      }),
      institutionSDK.armada.accessControl.grantGeneralRole({
        chainId: NetworkIds.BASEMAINNET, // Base
        role: GeneralRoles.DECAY_CONTROLLER_ROLE,
        targetAddress: dummyAddress, // Replace with actual address
      }),
    ])

  return {
    debugAQ,
    debugDC,
    debugG,
    debugSK,
    // eslint-disable-next-line camelcase
    debugGrantGeneralRoleTX_DO_NOT_EXECUTE,
  }
}
