import { IToken } from "../interfaces/IToken";

export function isSameTokens(a: IToken, b: IToken): boolean {
  return (
    a.address.value.toLowerCase() === b.address.value.toLowerCase() &&
    a.chainInfo.chainId === b.chainInfo.chainId
  )
}
