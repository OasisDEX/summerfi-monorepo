export const IPoolV3Abi = [{"type":"function","name":"ADDRESSES_PROVIDER","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IPoolAddressesProvider"}],"stateMutability":"view"},{"type":"function","name":"getReserveData","inputs":[{"name":"asset","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"tuple","internalType":"struct DataTypes.ReserveData","components":[{"name":"configuration","type":"tuple","internalType":"struct DataTypes.ReserveConfigurationMap","components":[{"name":"data","type":"uint256","internalType":"uint256"}]},{"name":"liquidityIndex","type":"uint128","internalType":"uint128"},{"name":"currentLiquidityRate","type":"uint128","internalType":"uint128"},{"name":"variableBorrowIndex","type":"uint128","internalType":"uint128"},{"name":"currentVariableBorrowRate","type":"uint128","internalType":"uint128"},{"name":"currentStableBorrowRate","type":"uint128","internalType":"uint128"},{"name":"lastUpdateTimestamp","type":"uint40","internalType":"uint40"},{"name":"id","type":"uint16","internalType":"uint16"},{"name":"aTokenAddress","type":"address","internalType":"address"},{"name":"stableDebtTokenAddress","type":"address","internalType":"address"},{"name":"variableDebtTokenAddress","type":"address","internalType":"address"},{"name":"interestRateStrategyAddress","type":"address","internalType":"address"},{"name":"accruedToTreasury","type":"uint128","internalType":"uint128"},{"name":"unbacked","type":"uint128","internalType":"uint128"},{"name":"isolationModeTotalDebt","type":"uint128","internalType":"uint128"}]}],"stateMutability":"view"},{"type":"function","name":"supply","inputs":[{"name":"asset","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"onBehalfOf","type":"address","internalType":"address"},{"name":"referralCode","type":"uint16","internalType":"uint16"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"withdraw","inputs":[{"name":"asset","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"to","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"event","name":"Supply","inputs":[{"name":"reserve","type":"address","indexed":true,"internalType":"address"},{"name":"user","type":"address","indexed":false,"internalType":"address"},{"name":"onBehalfOf","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"referralCode","type":"uint16","indexed":true,"internalType":"uint16"}],"anonymous":false}] as const