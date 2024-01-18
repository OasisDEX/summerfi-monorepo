import { RiskRatio, Percentage } from "~sdk/common";

/**
 * @class RiskRatio
 * @see RiskRatio
 */
export class RiskRatioImpl implements RiskRatio {
    /// Instance Attributes
    public readonly ratio: Percentage;

    /// Constructor
    private constructor(params: { ratio: Percentage }) {
        this.ratio = params.ratio;
    }

    /// Static Methods
    public static fromPercentage(params: { ratio: Percentage }): RiskRatio {
        return new RiskRatioImpl(params);
    }
}
