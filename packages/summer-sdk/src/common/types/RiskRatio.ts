import { IRiskRatio, Percentage } from "@sdk/common";

/**
 * @class RiskRatio
 * @see IRiskRatio
 */
export class RiskRatio implements IRiskRatio {
    /// Instance Attributes
    public readonly ratio: Percentage;

    /// Constructor
    private constructor(params: { ratio: Percentage }) {
        this.ratio = params.ratio;
    }

    /// Static Methods
    public static fromPercentage(params: { ratio: Percentage }): RiskRatio {
        return new RiskRatio(params);
    }
}
