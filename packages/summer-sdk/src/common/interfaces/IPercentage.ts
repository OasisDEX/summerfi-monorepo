import { IPrintable } from "./IPrintable";

/**
 * @name PercentageType
 * @description Represents the type of a percentage
 */
export enum PercentageType {
    /** The percentage is a proportion, this is a number between 0 and 1 */
    Proportion = "Proportion",
    /** The percentage is an absolute value, this is a number between 0 and 100 */
    Percentage = "Percentage",
}

/**
 * @interface IPercentage
 * @description Represents a percentage
 */
export interface IPercentage extends IPrintable {
    value: number;
    type: PercentageType;
}
