export const IArkConfigProviderAbi = [{"type":"function","name":"commander","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"depositCap","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getConfig","inputs":[],"outputs":[{"name":"","type":"tuple","internalType":"struct ArkConfig","components":[{"name":"commander","type":"address","internalType":"address"},{"name":"raft","type":"address","internalType":"address"},{"name":"token","type":"address","internalType":"contract IERC20"},{"name":"depositCap","type":"uint256","internalType":"uint256"},{"name":"maxRebalanceOutflow","type":"uint256","internalType":"uint256"},{"name":"maxRebalanceInflow","type":"uint256","internalType":"uint256"},{"name":"name","type":"string","internalType":"string"},{"name":"requiresKeeperData","type":"bool","internalType":"bool"},{"name":"maxDepositPercentageOfTVL","type":"uint256","internalType":"Percentage"}]}],"stateMutability":"view"},{"type":"function","name":"maxDepositPercentageOfTVL","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"Percentage"}],"stateMutability":"view"},{"type":"function","name":"maxRebalanceInflow","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"maxRebalanceOutflow","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"name","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"registerFleetCommander","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"requiresKeeperData","inputs":[],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"setDepositCap","inputs":[{"name":"newDepositCap","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setMaxDepositPercentageOfTVL","inputs":[{"name":"newMaxDepositPercentageOfTVL","type":"uint256","internalType":"Percentage"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setMaxRebalanceInflow","inputs":[{"name":"newMaxRebalanceInflow","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setMaxRebalanceOutflow","inputs":[{"name":"newMaxRebalanceOutflow","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"token","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IERC20"}],"stateMutability":"view"},{"type":"function","name":"unregisterFleetCommander","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"DepositCapUpdated","inputs":[{"name":"newCap","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"FleetCommanderRegistered","inputs":[{"name":"commander","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"FleetCommanderUnregistered","inputs":[{"name":"commander","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"MaxDepositPercentageOfTVLUpdated","inputs":[{"name":"newMaxDepositPercentageOfTVL","type":"uint256","indexed":false,"internalType":"Percentage"}],"anonymous":false},{"type":"event","name":"MaxRebalanceInflowUpdated","inputs":[{"name":"newMaxInflow","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"MaxRebalanceOutflowUpdated","inputs":[{"name":"newMaxOutflow","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"RaftUpdated","inputs":[{"name":"newRaft","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"error","name":"CannotDeployArkWithEmptyName","inputs":[]},{"type":"error","name":"CannotDeployArkWithoutConfigurationManager","inputs":[]},{"type":"error","name":"CannotDeployArkWithoutRaft","inputs":[]},{"type":"error","name":"CannotDeployArkWithoutToken","inputs":[]},{"type":"error","name":"ERC4626AssetMismatch","inputs":[]},{"type":"error","name":"InvalidVaultAddress","inputs":[]}] as const