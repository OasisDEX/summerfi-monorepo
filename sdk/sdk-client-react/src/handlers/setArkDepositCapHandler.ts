import {
  Address,
  ArmadaVaultId,
  IChainInfo,
  IToken,
  TokenAmount,
  type ISDKAdminManager,
} from '@summerfi/sdk-client'

export const setArkDepositCapHandler =
  (sdk: ISDKAdminManager) =>
  async ({
    cap,
    arkAddress,
    fleetAddress,
    chainInfo,
    token,
  }: {
    arkAddress: string
    fleetAddress: string
    cap: string
    chainInfo: IChainInfo
    token: IToken
  }) => {
    return sdk.armada.admin.setArkDepositCap({
      ark: Address.createFromEthereum({ value: arkAddress }),
      vaultId: ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
      }),
      cap: TokenAmount.createFrom({ token, amount: cap }),
    })
  }
