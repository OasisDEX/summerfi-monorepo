export const governanceStakingStatsQuery = `
  query GetStakingStatsV2($id: ID!) {
    governanceStakings(where: { id: $id }) {
      id
      summerStakedNormalized
      averageLockupPeriod
      amountOfLockedStakes
      circulatingSupply
    }
  }
`
