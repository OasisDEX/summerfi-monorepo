export const ExchangeRateProviderAbi = [{"type":"function","name":"basePrice","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getExchangeRate","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getExchangeRateEma","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getLowerBound","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getUpperBound","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"lowerPercentageRange","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"Percentage"}],"stateMutability":"view"},{"type":"function","name":"upperPercentageRange","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"Percentage"}],"stateMutability":"view"},{"type":"event","name":"BasePriceUpdated","inputs":[{"name":"basePrice","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"EmaRangeUpdated","inputs":[{"name":"lowerPercentageRange","type":"uint256","indexed":false,"internalType":"Percentage"},{"name":"upperPercentageRange","type":"uint256","indexed":false,"internalType":"Percentage"}],"anonymous":false},{"type":"error","name":"EmaRangeTooHigh","inputs":[{"name":"emaRange","type":"uint256","internalType":"Percentage"}]}] as const