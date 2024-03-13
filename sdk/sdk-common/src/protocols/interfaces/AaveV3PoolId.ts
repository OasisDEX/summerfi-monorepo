import {ChainInfo} from "~sdk-common/common";
import {IPoolId, ProtocolName} from "~sdk-common/protocols";
import { EmodeType } from '../enums/EmodeType'


// TODO: temporary interface so FE can create this data types without talking to a service
export interface AaveV3PoolId extends IPoolId {
    protocol: {
        name: ProtocolName.AAVEv3,
        chainInfo: ChainInfo
    }
    emodeType: EmodeType
}

export function isAaveV3PoolId(poolId: IPoolId): poolId is AaveV3PoolId {
    return poolId.protocol.name === ProtocolName.AAVEv3
}
