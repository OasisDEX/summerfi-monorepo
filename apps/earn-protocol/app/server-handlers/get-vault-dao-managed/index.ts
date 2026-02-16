import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { subgraphNetworkToSDKId } from '@summerfi/app-utils'

import { getSSRPublicClient } from '@/helpers/get-ssr-public-client'

export const getIsVaultDaoManaged = async ({
  fleetAddress,
  network,
}: {
  fleetAddress: string
  network: SupportedSDKNetworks
}) => {
  try {
    const chainId = subgraphNetworkToSDKId(network)
    const publicClient = await getSSRPublicClient(chainId)

    if (!publicClient) {
      // eslint-disable-next-line no-console
      console.error('Public client not available for network:', network)

      return false
    }

    const vaultDetails = await publicClient.readContract({
      address: fleetAddress as `0x${string}`,
      abi: [
        {
          inputs: [],
          name: 'details',
          outputs: [{ internalType: 'string', name: '', type: 'string' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'details',
    })

    try {
      const detailsString = JSON.parse(vaultDetails as string) as
        | {
            name: string
            chainId: number
            asset: string
            assetSymbol: string
            type: string
          }
        | undefined

      return detailsString && detailsString.type === 'dao'
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error parsing vault details:', error)

      return false
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error checking if vault is DAO managed:', error)

    return false
  }
}
