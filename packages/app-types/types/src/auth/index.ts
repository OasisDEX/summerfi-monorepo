export interface JwtPayload {
  address: string
  signature: string
  challenge: string
  chainId: number
}

export interface JWTChallenge {
  randomChallenge: string
  address: `0x${string}`
}
