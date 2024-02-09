import { TokenAmount } from '~sdk/common';

export interface Swap {
  fromTokenAmount: TokenAmount;
  toTokenAmount: TokenAmount;
  slippage: number;
  fee: number;
}
