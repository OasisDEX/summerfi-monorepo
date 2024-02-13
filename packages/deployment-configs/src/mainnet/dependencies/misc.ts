import { MiscDependencyConfig } from '@summerfi/deployment-types'

export const MiscDependenciesConfiguration: MiscDependencyConfig = {
  GnosisSafe: {
    name: 'GnosisSafe',
    address: '0x85f9b7408afE6CEb5E46223451f5d4b832B522dc',
  },
  UniswapRouter: {
    name: 'UniswapRouter',
    address: '0xe592427a0aece92de3edee1f18e0157c05861564',
    addToRegistry: true,
  },
  BalancerVault: {
    name: 'BalancerVault',
    address: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    addToRegistry: true,
  },
  OneInchAggregator: {
    name: 'OneInchAggregator',
    address: '0x1111111254fb6c44bac0bed2854e76f90643097d',
    addToRegistry: true,
  },
  AuthorizedCaller: {
    name: 'AuthorizedCaller',
    address: '0x85f9b7408afE6CEb5E46223451f5d4b832B522dc',
  },
  FeeRecipient: {
    name: 'FeeRecipient',
    address: '0xC7b548AD9Cf38721810246C079b2d8083aba8909',
  },
  MerkleRedeemer: {
    name: 'MerkleRedeemer',
    address: '0xd9fabf81Ed15ea71FBAd0C1f77529a4755a38054',
  },
  DssCharter: { name: 'DssCharter', address: '0x0000123' },
  DssProxyActions: {
    name: 'DssProxyActions',
    address: '0x82ecD135Dce65Fbc6DbdD0e4237E0AF93FFD5038',
  },
  DssProxyActionsCharter: { name: 'DssProxyActionsCharter', address: '0x0000' },
  DssMultiplyProxyActions: {
    name: 'DssMultiplyProxyActions',
    address: '0x2a49eae5cca3f050ebec729cf90cc910fadaf7a2',
  },
  DssCropper: {
    name: 'DssCropper',
    address: '0x8377CD01a5834a6EaD3b7efb482f678f2092b77e',
  },
  DssProxyActionsCropjoin: {
    name: 'DssProxyActionsCropjoin',
    address: '0xa2f69F8B9B341CFE9BfBb3aaB5fe116C89C95bAF',
  },
  DssProxyActionsDsr: {
    name: 'DssProxyActionsDsr',
    address: '0x07ee93aEEa0a36FfF2A9B95dd22Bd6049EE54f26',
  },
  Otc: {
    name: 'Otc',
    address: '0x794e6e91555438aFc3ccF1c5076A74F42133d08D',
  },
  OtcSupportMethods: {
    name: 'OtcSupportMethods',
    address: '0x9b3f075b12513afe56ca2ed838613b7395f57839',
  },
  ServiceRegistry: {
    name: 'ServiceRegistry',
    address: '0x9b4Ae7b164d195df9C4Da5d08Be88b2848b2EaDA',
  },
  GuniProxyActions: {
    name: 'GuniProxyActions',
    address: '0xed3a954c0adfc8e3f85d92729c051ff320648e30',
  },
  GuniResolver: {
    name: 'GuniResolver',
    address: '0x0317650Af6f184344D7368AC8bB0bEbA5EDB214a',
  },
  GuniRouter: {
    name: 'GuniRouter',
    address: '0x14E6D67F824C3a7b4329d3228807f8654294e4bd',
  },
  CdpRegistry: {
    name: 'CdpRegistry',
    address: '0xBe0274664Ca7A68d6b5dF826FB3CcB7c620bADF3',
  },
  DefaultExchange: {
    name: 'DefaultExchange',
    address: '0xb5eB8cB6cED6b6f8E13bcD502fb489Db4a726C7B',
  },
  NoFeesExchange: {
    name: 'NoFeesExchange',
    address: '0x99e4484dac819aa74b347208752306615213d324',
  },
  LowerFeesExchange: {
    name: 'LowerFeesExchange',
    address: '0xf22f17b1d2354b4f4f52e4d164e4eb5e1f0a6ba6',
  },
  LidoCrvLiquidityFarmingReward: {
    name: 'LidoCrvLiquidityFarmingReward',
    address: '0x99ac10631f69c753ddb595d074422a0922d9056b',
  },
  ChainlinkPriceOracle_USDCUSD: {
    name: 'ChainlinkPriceOracle_USDCUSD',
    address: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
  },
  ChainlinkPriceOracle_ETHUSD: {
    name: 'ChainlinkPriceOracle_ETHUSD',
    address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  },
  SdaiOracle: {
    name: 'SdaiOracle',
    address: '0xb9E6DBFa4De19CCed908BcbFe1d015190678AB5f',
  },
}
