import { ITokenData } from '../interfaces/IToken'

export function isSameTokens(a: ITokenData, b: ITokenData): boolean {
  return (
    a.address.value.toLowerCase() === b.address.value.toLowerCase() &&
    a.chainInfo.chainId === b.chainInfo.chainId
  )
}
