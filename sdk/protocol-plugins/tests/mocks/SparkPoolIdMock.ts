import {ChainInfo} from "@summerfi/sdk-common/common";
import {EmodeType} from "@summerfi/sdk-common/protocols";
import {ILKType, ProtocolName} from "@summerfi/sdk-common/protocols";

export const sparkPoolIdMock = {
    protocol: {
        name: ProtocolName.Spark,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
    },
    emodeType: EmodeType.None
}