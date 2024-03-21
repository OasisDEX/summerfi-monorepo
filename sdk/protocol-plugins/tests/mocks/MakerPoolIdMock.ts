import {ChainInfo} from "@summerfi/sdk-common/common";
import {ILKType, ProtocolName} from "@summerfi/sdk-common/protocols";

export const makerPoolIdMock = {
    protocol: {
        name: ProtocolName.Maker,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
    },
    ilkType: ILKType.ETH_A,
    vaultId: '123',
}