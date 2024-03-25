import {Percentage} from "@summerfi/sdk-common/common";
import {QuoteData} from "./QuoteData";

export type SimulatedSwapData = QuoteData & {
    slippage: Percentage
    fee: Percentage
}
