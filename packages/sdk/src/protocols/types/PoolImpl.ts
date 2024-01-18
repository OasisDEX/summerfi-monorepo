import { Address } from "~sdk/common";
import { Pool, PoolId, ProtocolId, PoolType } from "~sdk/protocols";

/**
 * @class Pool
 * @see IPool
 */
export class PoolImpl implements Pool {
    /// Instance Attributes
    public readonly poolId: PoolId;
    public readonly protocolid: ProtocolId;
    public readonly type: PoolType;
    public readonly address?: Address;
    public readonly TVL?: number;

    /// Constructor
    constructor(params: {
        poolId: PoolId;
        protocolid: ProtocolId;
        type: PoolType;
        address?: Address;
        TVL?: number;
    }) {
        this.poolId = params.poolId;
        this.protocolid = params.protocolid;
        this.type = params.type;
        this.address = params.address;
        this.TVL = params.TVL;
    }
}
