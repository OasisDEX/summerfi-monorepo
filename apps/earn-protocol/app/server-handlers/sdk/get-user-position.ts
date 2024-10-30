// import { type SDKNetwork } from '@summerfi/app-types'
// import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'

// import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
// import { subgraphNetworkToId } from '@/helpers/network-helpers'

export async function getUserPosition() {
  // just debugging here
  // export async function getUserPosition(
  //   {
  //     network,
  //     vaultAddress,
  //     walletAddress,
  //   }: {
  //     network: SDKNetwork
  //     vaultAddress: string
  //     walletAddress: string
  //   },
  // ) {

  // try {
  //   const chainId = subgraphNetworkToId(network)
  //   const chainInfo = getChainInfoByChainId(chainId)

  //   const fleetAddress = Address.createFromEthereum({
  //     value: vaultAddress,
  //   })

  //   const wallet = Wallet.createFrom({
  //     address: Address.createFromEthereum({
  //       value: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA',
  //     }),
  //   })
  //   const user = User.createFrom({
  //     chainInfo,
  //     wallet,
  //   })
  //   const position = await backendSDK.armada.users.getPosition({
  //     // fleetAddress,
  //     user,
  //   })
  return await Promise.resolve(null)
  // } catch (error) {
  //   throw new Error(`Failed to get vault details: ${error}`)
  // }
}
