export const TipJarTestAbi = [{"type":"function","name":"IS_TEST","inputs":[],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"accessManager","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract ProtocolAccessManager"}],"stateMutability":"view"},{"type":"function","name":"configManager","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract ConfigurationManagerMock"}],"stateMutability":"view"},{"type":"function","name":"excludeArtifacts","inputs":[],"outputs":[{"name":"excludedArtifacts_","type":"string[]","internalType":"string[]"}],"stateMutability":"view"},{"type":"function","name":"excludeContracts","inputs":[],"outputs":[{"name":"excludedContracts_","type":"address[]","internalType":"address[]"}],"stateMutability":"view"},{"type":"function","name":"excludeSelectors","inputs":[],"outputs":[{"name":"excludedSelectors_","type":"tuple[]","internalType":"struct StdInvariant.FuzzSelector[]","components":[{"name":"addr","type":"address","internalType":"address"},{"name":"selectors","type":"bytes4[]","internalType":"bytes4[]"}]}],"stateMutability":"view"},{"type":"function","name":"excludeSenders","inputs":[],"outputs":[{"name":"excludedSenders_","type":"address[]","internalType":"address[]"}],"stateMutability":"view"},{"type":"function","name":"failed","inputs":[],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"fleetCommander","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract FleetCommanderMock"}],"stateMutability":"view"},{"type":"function","name":"governor","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"keeper","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"mockTipStreamRecipient","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"setUp","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"targetArtifactSelectors","inputs":[],"outputs":[{"name":"targetedArtifactSelectors_","type":"tuple[]","internalType":"struct StdInvariant.FuzzArtifactSelector[]","components":[{"name":"artifact","type":"string","internalType":"string"},{"name":"selectors","type":"bytes4[]","internalType":"bytes4[]"}]}],"stateMutability":"view"},{"type":"function","name":"targetArtifacts","inputs":[],"outputs":[{"name":"targetedArtifacts_","type":"string[]","internalType":"string[]"}],"stateMutability":"view"},{"type":"function","name":"targetContracts","inputs":[],"outputs":[{"name":"targetedContracts_","type":"address[]","internalType":"address[]"}],"stateMutability":"view"},{"type":"function","name":"targetInterfaces","inputs":[],"outputs":[{"name":"targetedInterfaces_","type":"tuple[]","internalType":"struct StdInvariant.FuzzInterface[]","components":[{"name":"addr","type":"address","internalType":"address"},{"name":"artifacts","type":"string[]","internalType":"string[]"}]}],"stateMutability":"view"},{"type":"function","name":"targetSelectors","inputs":[],"outputs":[{"name":"targetedSelectors_","type":"tuple[]","internalType":"struct StdInvariant.FuzzSelector[]","components":[{"name":"addr","type":"address","internalType":"address"},{"name":"selectors","type":"bytes4[]","internalType":"bytes4[]"}]}],"stateMutability":"view"},{"type":"function","name":"targetSenders","inputs":[],"outputs":[{"name":"targetedSenders_","type":"address[]","internalType":"address[]"}],"stateMutability":"view"},{"type":"function","name":"test_AddTipStream","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_Constructor","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_FailAddTipStreamNonGovernor","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_FailAddTipStreamWithInvalidAllocation","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_FailExceedTotalAllocation","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_FailRemoveNonexistentTipStream","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_FailSetInvalidTreasuryAddress","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_FailShakeInvalidFleetCommanderAddress","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_FailShakeWithNoAssets","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_FailShakeWithNoShares","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_FailUpdateTipStreamBeforeMinTerm","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_GetAllTipStreams","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_GetAllTipStreamsEmpty","inputs":[],"outputs":[],"stateMutability":"view"},{"type":"function","name":"test_GetAllTipStreamsMultiple","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_GetTotalAllocation","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_RemoveTipStream","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_SetTreasuryAddress","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_Shake","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_ShakeMultiple","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_ShakeWith100PercentAllocations","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_ShakeWithAccruedInterest","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"test_UpdateTipStream","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"tipJar","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract TipJar"}],"stateMutability":"view"},{"type":"function","name":"treasury","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"underlyingToken","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract ERC20Mock"}],"stateMutability":"view"},{"type":"event","name":"TipJarShaken","inputs":[{"name":"fleetCommander","type":"address","indexed":true,"internalType":"address"},{"name":"totalDistributed","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"TipStreamAdded","inputs":[{"name":"recipient","type":"address","indexed":true,"internalType":"address"},{"name":"allocation","type":"uint256","indexed":false,"internalType":"Percentage"},{"name":"lockedUntilEpoch","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"TipStreamRemoved","inputs":[{"name":"recipient","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"TipStreamUpdated","inputs":[{"name":"recipient","type":"address","indexed":true,"internalType":"address"},{"name":"newAllocation","type":"uint256","indexed":false,"internalType":"Percentage"},{"name":"newLockedUntilEpoch","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"log","inputs":[{"name":"","type":"string","indexed":false,"internalType":"string"}],"anonymous":false},{"type":"event","name":"log_address","inputs":[{"name":"","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"log_array","inputs":[{"name":"val","type":"uint256[]","indexed":false,"internalType":"uint256[]"}],"anonymous":false},{"type":"event","name":"log_array","inputs":[{"name":"val","type":"int256[]","indexed":false,"internalType":"int256[]"}],"anonymous":false},{"type":"event","name":"log_array","inputs":[{"name":"val","type":"address[]","indexed":false,"internalType":"address[]"}],"anonymous":false},{"type":"event","name":"log_bytes","inputs":[{"name":"","type":"bytes","indexed":false,"internalType":"bytes"}],"anonymous":false},{"type":"event","name":"log_bytes32","inputs":[{"name":"","type":"bytes32","indexed":false,"internalType":"bytes32"}],"anonymous":false},{"type":"event","name":"log_int","inputs":[{"name":"","type":"int256","indexed":false,"internalType":"int256"}],"anonymous":false},{"type":"event","name":"log_named_address","inputs":[{"name":"key","type":"string","indexed":false,"internalType":"string"},{"name":"val","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"log_named_array","inputs":[{"name":"key","type":"string","indexed":false,"internalType":"string"},{"name":"val","type":"uint256[]","indexed":false,"internalType":"uint256[]"}],"anonymous":false},{"type":"event","name":"log_named_array","inputs":[{"name":"key","type":"string","indexed":false,"internalType":"string"},{"name":"val","type":"int256[]","indexed":false,"internalType":"int256[]"}],"anonymous":false},{"type":"event","name":"log_named_array","inputs":[{"name":"key","type":"string","indexed":false,"internalType":"string"},{"name":"val","type":"address[]","indexed":false,"internalType":"address[]"}],"anonymous":false},{"type":"event","name":"log_named_bytes","inputs":[{"name":"key","type":"string","indexed":false,"internalType":"string"},{"name":"val","type":"bytes","indexed":false,"internalType":"bytes"}],"anonymous":false},{"type":"event","name":"log_named_bytes32","inputs":[{"name":"key","type":"string","indexed":false,"internalType":"string"},{"name":"val","type":"bytes32","indexed":false,"internalType":"bytes32"}],"anonymous":false},{"type":"event","name":"log_named_decimal_int","inputs":[{"name":"key","type":"string","indexed":false,"internalType":"string"},{"name":"val","type":"int256","indexed":false,"internalType":"int256"},{"name":"decimals","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"log_named_decimal_uint","inputs":[{"name":"key","type":"string","indexed":false,"internalType":"string"},{"name":"val","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"decimals","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"log_named_int","inputs":[{"name":"key","type":"string","indexed":false,"internalType":"string"},{"name":"val","type":"int256","indexed":false,"internalType":"int256"}],"anonymous":false},{"type":"event","name":"log_named_string","inputs":[{"name":"key","type":"string","indexed":false,"internalType":"string"},{"name":"val","type":"string","indexed":false,"internalType":"string"}],"anonymous":false},{"type":"event","name":"log_named_uint","inputs":[{"name":"key","type":"string","indexed":false,"internalType":"string"},{"name":"val","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"log_string","inputs":[{"name":"","type":"string","indexed":false,"internalType":"string"}],"anonymous":false},{"type":"event","name":"log_uint","inputs":[{"name":"","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"logs","inputs":[{"name":"","type":"bytes","indexed":false,"internalType":"bytes"}],"anonymous":false}] as const