import { IToken } from '../interfaces/IToken'

export function isSameTokens(a: IToken, b: IToken): boolean {
  return a.address === b.address && a.chainInfo.chainId === b.chainInfo.chainId
}
