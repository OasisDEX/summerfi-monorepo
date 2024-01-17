import { IAddress } from "@sdk/common";
import { IPool, IPoolId, IProtocolId, PoolType } from "@sdk/protocols";

/**
 * @class Pool
 * @see IPool
 */
export class Pool implements IPool {
    /// Instance Attributes
    public readonly poolId: IPoolId;
    public readonly protocolid: IProtocolId;
    public readonly type: PoolType;
    public readonly address?: IAddress;
    public readonly TVL?: number;

    /// Constructor
    constructor(params: {
        poolId: IPoolId;
        protocolid: IProtocolId;
        type: PoolType;
        address?: IAddress;
        TVL?: number;
    }) {
        this.poolId = params.poolId;
        this.protocolid = params.protocolid;
        this.type = params.type;
        this.address = params.address;
        this.TVL = params.TVL;
    }
}
