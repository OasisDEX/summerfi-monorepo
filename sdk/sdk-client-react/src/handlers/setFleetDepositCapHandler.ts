import {
  Address,
  ArmadaVaultId,
  IChainInfo,
  IToken,
  TokenAmount,
  type ISDKInstiManager,
} from '@summerfi/sdk-client'

export const setFleetDepositCapHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    cap,
    fleetAddress,
    chainInfo,
    token,
  }: {
    fleetAddress: string
    cap: string
    chainInfo: IChainInfo
    token: IToken
  }) => {
    return sdk.armada.admin.setFleetDepositCap({
      cap: TokenAmount.createFrom({ token, amount: cap }),
      vaultId: ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
      }),
    })
  }
