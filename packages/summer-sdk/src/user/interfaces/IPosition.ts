import { IRiskRatio, ITokenAmount } from "@sdk/common";
import { IPool } from "@sdk/protocols";

/**
 * @name PositionId
 * @description Represents a position ID
 */
export type PositionId = {
    id: string;
};

/**
 * @interface IPosition
 * @description Represents a user's position, including risk ratio, current collateral,
 *              borrowed debts, etc..
 */
export interface IPosition {
    positionId: PositionId;
    debtAmount: ITokenAmount;
    collateralAmount: ITokenAmount;
    riskRatio: IRiskRatio;
    pool: IPool;
}
