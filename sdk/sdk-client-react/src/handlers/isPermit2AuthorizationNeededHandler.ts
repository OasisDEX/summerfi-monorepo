import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue } from '@summerfi/sdk-common'
import type { PublicClient } from 'viem'
import { Address } from '@summerfi/sdk-common'

/**
 * @name isPermit2AuthorizationNeededHandler
 * @description Checks if the Permit2 contract needs authorization for a specific token and amount
 * @param params.ownerAddress The token owner's address
 * @param params.tokenAddress The ERC-20 token address to check
 * @param params.amount The required amount (in token base units) to check against the current allowance
 * @param params.publicClient The viem public client for reading blockchain state
 * @returns True if the current Permit2 allowance is less than the required amount
 */
export const isPermit2AuthorizationNeededHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    ownerAddress,
    tokenAddress,
    amount,
    publicClient,
  }: {
    ownerAddress: AddressValue
    tokenAddress: AddressValue
    amount: bigint
    publicClient: PublicClient
  }): Promise<boolean> => {
    return sdk.intentSwaps.isPermit2AuthorizationNeeded({
      ownerAddress: Address.createFromEthereum({ value: ownerAddress }),
      tokenAddress: Address.createFromEthereum({ value: tokenAddress }),
      amount,
      publicClient,
    })
  }
