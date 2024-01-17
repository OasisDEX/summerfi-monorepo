import { IPoolId, IProtocolId } from "./IDs";
import { IPool } from "./IPool";
import { IPoolParameters } from "./IPoolParameters";
import { IProtocolParameters } from "./IProtocolParameters";

/**
 * @interface IProtocol
 * @description Represents a protocol. Provides methods for getting pools
 */
export interface IProtocol {
    protocolId: IProtocolId;

    getPool(params: { poolParameters: IPoolParameters; protocolParameters?: IProtocolParameters }): Promise<IPool>;
    getAllPools(params: { protocolParameters?: IProtocolParameters }): Promise<IPool[]>;
}
