import {
  Address,
  ArmadaVaultId,
  IChainInfo,
  IToken,
  TokenAmount,
  type ISDKAdminManager,
} from '@summerfi/sdk-client'

export const setMinimumBufferBalanceHandler =
  (sdk: ISDKAdminManager) =>
  async ({
    minimumBufferBalance,
    fleetAddress,
    chainInfo,
    token,
  }: {
    fleetAddress: string
    minimumBufferBalance: string
    chainInfo: IChainInfo
    token: IToken
  }) => {
    return sdk.armada.admin.setMinimumBufferBalance({
      minimumBufferBalance: TokenAmount.createFrom({ token, amount: minimumBufferBalance }),
      vaultId: ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
      }),
    })
  }
