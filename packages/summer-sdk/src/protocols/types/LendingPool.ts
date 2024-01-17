import { IAddress, Token } from "@sdk/common";
import { IPoolId, IProtocolId, PoolType, ILendingPool } from "@sdk/protocols";
import { Pool } from "./Pool";

/**
 * @class LendingPool
 * @see ILendingPool
 */
export class LendingPool extends Pool implements ILendingPool {
    /// Instance Attributes
    public readonly debtToken: Token;
    public readonly collateralToken: Token;

    /// Constructor
    constructor(params: {
        poolId: IPoolId;
        protocolid: IProtocolId;
        address?: IAddress;
        TVL?: number;
        debtToken: Token;
        collateralToken: Token;
    }) {
        super({ ...params, type: PoolType.Lending });

        this.debtToken = params.debtToken;
        this.collateralToken = params.collateralToken;
    }
}
