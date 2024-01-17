import { IPercentage } from "@sdk/common";
import { PercentageType } from "@sdk/common/interfaces/IPercentage";

/**
 * @class Percentage
 * @see IPercentage
 */
export class Percentage implements IPercentage {
    /// Instance Attributes
    public readonly value: number;
    public readonly type: PercentageType;

    /// Constructor
    constructor(params: { value: number; type: PercentageType }) {
        this.value = params.value;
        this.type = params.type;
    }

    /// Static Methods
    static fromNormalized(value: number) {
        return new Percentage({ value, type: PercentageType.Proportion });
    }
    static fromAbsolute(value: number) {
        return new Percentage({ value, type: PercentageType.Percentage });
    }

    /// Instance Methods
    toString(): string {
        return this.type === PercentageType.Proportion ? `${this.value * 100.0}%` : `%{value}%`;
    }
}
