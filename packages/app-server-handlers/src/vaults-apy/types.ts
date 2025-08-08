export type GetVaultsApyParams = {
  fleets: {
    fleetAddress: string
    chainId: number
  }[]
}

export type GetVaultsApyRAWResponse = {
  rates: {
    chainId: number
    fleetAddress: string
    sma: {
      sma24h: string | null
      sma7d: string | null
      sma30d: string | null
    }
    rates: [
      {
        id: string
        rate: string
        timestamp: number
        fleetAddress: string
      },
    ]
  }[]
}
