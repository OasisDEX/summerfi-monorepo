export const IAuctionManagerBaseEventsAbi = [{"type":"event","name":"AuctionDefaultParametersUpdated","inputs":[{"name":"newConfig","type":"tuple","indexed":false,"internalType":"struct AuctionDefaultParameters","components":[{"name":"duration","type":"uint40","internalType":"uint40"},{"name":"startPrice","type":"uint256","internalType":"uint256"},{"name":"endPrice","type":"uint256","internalType":"uint256"},{"name":"kickerRewardPercentage","type":"uint256","internalType":"Percentage"},{"name":"decayType","type":"uint8","internalType":"enum DecayFunctions.DecayType"}]}],"anonymous":false}] as const