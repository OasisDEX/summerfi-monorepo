export const IMetaMorphoBaseAbi = [{"type":"function","name":"DECIMALS_OFFSET","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"MORPHO","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IMorpho"}],"stateMutability":"view"},{"type":"function","name":"acceptCap","inputs":[{"name":"marketParams","type":"tuple","internalType":"struct MarketParams","components":[{"name":"loanToken","type":"address","internalType":"address"},{"name":"collateralToken","type":"address","internalType":"address"},{"name":"oracle","type":"address","internalType":"address"},{"name":"irm","type":"address","internalType":"address"},{"name":"lltv","type":"uint256","internalType":"uint256"}]}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"acceptGuardian","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"acceptTimelock","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"curator","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"fee","inputs":[],"outputs":[{"name":"","type":"uint96","internalType":"uint96"}],"stateMutability":"view"},{"type":"function","name":"feeRecipient","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"guardian","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"isAllocator","inputs":[{"name":"target","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"lastTotalAssets","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"reallocate","inputs":[{"name":"allocations","type":"tuple[]","internalType":"struct MarketAllocation[]","components":[{"name":"marketParams","type":"tuple","internalType":"struct MarketParams","components":[{"name":"loanToken","type":"address","internalType":"address"},{"name":"collateralToken","type":"address","internalType":"address"},{"name":"oracle","type":"address","internalType":"address"},{"name":"irm","type":"address","internalType":"address"},{"name":"lltv","type":"uint256","internalType":"uint256"}]},{"name":"assets","type":"uint256","internalType":"uint256"}]}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"revokePendingCap","inputs":[{"name":"id","type":"bytes32","internalType":"Id"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"revokePendingGuardian","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"revokePendingMarketRemoval","inputs":[{"name":"id","type":"bytes32","internalType":"Id"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"revokePendingTimelock","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setCurator","inputs":[{"name":"newCurator","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setFee","inputs":[{"name":"newFee","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setFeeRecipient","inputs":[{"name":"newFeeRecipient","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setIsAllocator","inputs":[{"name":"newAllocator","type":"address","internalType":"address"},{"name":"newIsAllocator","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setSkimRecipient","inputs":[{"name":"newSkimRecipient","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setSupplyQueue","inputs":[{"name":"newSupplyQueue","type":"bytes32[]","internalType":"Id[]"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"skim","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"skimRecipient","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"submitCap","inputs":[{"name":"marketParams","type":"tuple","internalType":"struct MarketParams","components":[{"name":"loanToken","type":"address","internalType":"address"},{"name":"collateralToken","type":"address","internalType":"address"},{"name":"oracle","type":"address","internalType":"address"},{"name":"irm","type":"address","internalType":"address"},{"name":"lltv","type":"uint256","internalType":"uint256"}]},{"name":"newSupplyCap","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"submitGuardian","inputs":[{"name":"newGuardian","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"submitMarketRemoval","inputs":[{"name":"marketParams","type":"tuple","internalType":"struct MarketParams","components":[{"name":"loanToken","type":"address","internalType":"address"},{"name":"collateralToken","type":"address","internalType":"address"},{"name":"oracle","type":"address","internalType":"address"},{"name":"irm","type":"address","internalType":"address"},{"name":"lltv","type":"uint256","internalType":"uint256"}]}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"submitTimelock","inputs":[{"name":"newTimelock","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"supplyQueue","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bytes32","internalType":"Id"}],"stateMutability":"view"},{"type":"function","name":"supplyQueueLength","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"timelock","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"updateWithdrawQueue","inputs":[{"name":"indexes","type":"uint256[]","internalType":"uint256[]"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"withdrawQueue","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bytes32","internalType":"Id"}],"stateMutability":"view"},{"type":"function","name":"withdrawQueueLength","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"}] as const