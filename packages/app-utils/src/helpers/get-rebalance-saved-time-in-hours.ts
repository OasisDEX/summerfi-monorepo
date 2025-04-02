// used 5 min as average rebalance action
export const getRebalanceSavedTimeInHours = (totalItems: number): number =>
  Number(((totalItems * 5) / 60).toFixed(1))
