import { ChainFamilyMap } from '@summerfi/sdk-common'
import { TokenListData } from './TokensListData'

export const StaticTokensData: TokenListData = {
  name: 'Summer.fi Token List',
  timestamp: '2022-03-21T09:49:26.225Z',
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  tags: {},
  logoURI: 'https://summer.fi/static/img/logos/logo_dark.svg',
  keywords: ['Summer.fi', 'MakerDAO'],
  tokens: [
    // Ethereum Mainnet
    {
      name: 'ETHx',
      address: '0xA35b1B31Ce002FBF2058D22F30f95D405200A15b',
      symbol: 'ETHx',
      decimals: 18,
      chainId: 1,
      logoURI: '',
    },
    {
      name: 'PayPal USD',
      address: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
      symbol: 'PYUSD',
      decimals: 6,
      chainId: 1,
      logoURI: '',
    },
    {
      name: 'Curve.Fi USD Stablecoin',
      address: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E',
      symbol: 'crvUSD',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E/logo.png',
    },
    {
      name: 'Frax Share',
      address: '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
      symbol: 'FXS',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0/logo.png',
    },
    {
      name: 'Kyber Network Crystal v2',
      address: '0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202',
      symbol: 'KNC',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202/logo.png',
    },
    {
      name: 'StargateToken',
      address: '0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6',
      symbol: 'STG',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6/logo.png',
    },
    {
      name: 'Gho Token',
      address: '0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f',
      symbol: 'GHO',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f/logo.png',
    },
    {
      name: 'Frax',
      address: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
      symbol: 'FRAX',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png',
    },
    {
      name: '1INCH Token',
      address: '0x111111111117dC0aa78b770fA6A738034120C302',
      symbol: '1INCH',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x111111111117dC0aa78b770fA6A738034120C302/logo.png',
    },
    {
      name: 'Ethereum Name Service',
      address: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
      symbol: 'ENS',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72/logo.png',
    },
    {
      name: 'Balancer',
      address: '0xba100000625a3754423978a60c9317c58a424e3D',
      symbol: 'BAL',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png',
    },
    {
      name: 'Synthetix Network Token',
      address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
      symbol: 'SNX',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png',
    },
    {
      name: 'Curve DAO Token',
      address: '0xD533a949740bb3306d119CC777fa900bA034cd52',
      symbol: 'CRV',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png',
    },
    {
      name: 'Aave Token',
      address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      symbol: 'AAVE',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
    },
    {
      name: 'Lido DAO Token',
      address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
      symbol: 'LDO',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png',
    },
    {
      name: 'Coinbase Wrapped Staked ETH',
      address: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
      symbol: 'cbETH',
      decimals: 18,
      chainId: 1,
      logoURI: '',
    },
    {
      name: 'Rocket Pool Protocol',
      address: '0xD33526068D116cE69F19A9ee46F0bd304F21A51f',
      symbol: 'RPL',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD33526068D116cE69F19A9ee46F0bd304F21A51f/logo.png',
    },
    {
      name: 'LUSD Stablecoin',
      address: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
      symbol: 'LUSD',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0/logo.png',
    },
    {
      name: 'Renzo Restaked ETH',
      address: '0xbf5495Efe5DB9ce00f80364C8B423567e58d2110',
      symbol: 'ezETH',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xbf5495Efe5DB9ce00f80364C8B423567e58d2110/logo.png',
    },
    {
      name: 'Staked ETH',
      address: '0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38',
      symbol: 'osETH',
      decimals: 18,
      chainId: 1,
      logoURI: '',
    },
    {
      name: 'Wrapped eETH',
      address: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
      symbol: 'weETH',
      decimals: 18,
      chainId: 1,
      logoURI: '',
    },
    {
      name: 'USDe',
      address: '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3',
      symbol: 'USDe',
      decimals: 18,
      chainId: 1,
      logoURI: '',
    },
    {
      name: 'Staked USDe',
      address: '0x9D39A5DE30e57443BfF2A8307A4256c8797A3497',
      symbol: 'sUSDe',
      decimals: 18,
      chainId: 1,
      logoURI: '',
    },
    {
      name: 'Savings USDs',
      address: '0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD',
      symbol: 'sUSDs',
      decimals: 18,
      chainId: 1,
      logoURI: '',
    },
    {
      name: 'USDA',
      address: '0x0000206329b97DB379d5E1Bf586BbDB969C63274',
      symbol: 'USDA',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000206329b97DB379d5E1Bf586BbDB969C63274/logo.png',
    },
    {
      name: 'Dai Stablecoin',
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    },
    {
      name: 'ChainLink Token',
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      symbol: 'LINK',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
    },
    {
      chainId: 1,
      address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
      name: 'Decentraland',
      symbol: 'MANA',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png?1550108745',
    },
    {
      chainId: 1,
      address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912',
    },
    {
      name: 'Maker',
      address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
      symbol: 'MKR',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png',
    },
    {
      name: 'Uniswap',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      decimals: 18,
      chainId: 1,
      logoURI: 'ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg',
    },
    {
      name: 'USDCoin',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      decimals: 6,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    },
    {
      name: 'Wrapped BTC',
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      symbol: 'WBTC',
      decimals: 8,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
    },
    {
      name: 'Arbitrum Bridged WBTC',
      address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
      symbol: 'WBTC',
      decimals: 8,
      chainId: ChainFamilyMap.Arbitrum.ArbitrumOne.chainId,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
    },
    {
      name: 'Wrapped Ether',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WETH',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    },
    {
      chainId: 1,
      address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
      name: 'yearn finance',
      symbol: 'YFI',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/11849/thumb/yfi-192x192.png?1598325330',
    },
    {
      address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      chainId: 1,
      name: 'stETH',
      symbol: 'stETH',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0xae7ab96520de3a18e5e111b5eaab095312d7fe84.png',
    },
    {
      address: '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd',
      chainId: 1,
      name: 'Geminidollar',
      symbol: 'GUSD',
      decimals: 2,
      logoURI: 'https://tokens.1inch.io/0x056fd409e1d7a124bd7017459dfea2f387b6d5cd.png',
    },
    {
      address: '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
      chainId: 1,
      name: 'PaxDollar',
      symbol: 'USDP',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0x8e870d67f660d95d5be530380d0ec0bd388289e1.png',
    },
    {
      address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      chainId: 1,
      name: 'WrappedliquidstakedEther2.0',
      symbol: 'wstETH',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png',
    },
    {
      address: '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
      chainId: 1,
      name: 'renBTC',
      symbol: 'renBTC',
      decimals: 8,
      logoURI: 'https://tokens.1inch.io/0xeb4c2781e4eba804ce9a9803c67d0893436bb27d.png',
    },
    {
      name: 'Savings DAI',
      address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
      symbol: 'sDAI',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://tokens.1inch.io/0x83f20f44975d03b1b09e64809b757c47f942beea.png',
    },
    {
      name: 'Rocket ETH',
      address: '0xae78736Cd615f374D3085123A210448E74Fc6393',
      symbol: 'rETH',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://tokens.1inch.io/0xae78736cd615f374d3085123a210448e74fc6393.png',
    },
    {
      name: 'Gnosis Token',
      address: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
      symbol: 'GNO',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://tokens.1inch.io/0x6810e776880c02933d47db1b9fc05908e5386b96.png',
    },
    {
      name: 'Tether USD Stablecoin',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      decimals: 6,
      chainId: 1,
      logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
    },
    {
      name: 'Tether USD Stablecoin',
      address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      symbol: 'USDT',
      decimals: 6,
      chainId: 42161,
      logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
    },
    {
      name: 'Tether USD Stablecoin',
      address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
      symbol: 'USDT',
      decimals: 6,
      chainId: 8453,
      logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
    },
    // UNKNOWN
    {
      name: 'Dai Stablecoin',
      address: '0xaD6D458402F60fD3Bd25163575031ACDce07538D',
      symbol: 'DAI',
      decimals: 18,
      chainId: 3,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xaD6D458402F60fD3Bd25163575031ACDce07538D/logo.png',
    },
    {
      name: 'Uniswap',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      decimals: 18,
      chainId: 3,
      logoURI: 'ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg',
    },
    {
      name: 'Wrapped Ether',
      address: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
      symbol: 'WETH',
      decimals: 18,
      chainId: 3,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc778417E063141139Fce010982780140Aa0cD5Ab/logo.png',
    },
    // UNKNOWN
    {
      name: 'Dai Stablecoin',
      address: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
      symbol: 'DAI',
      decimals: 18,
      chainId: 4,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735/logo.png',
    },
    {
      name: 'Maker',
      address: '0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85',
      symbol: 'MKR',
      decimals: 18,
      chainId: 4,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85/logo.png',
    },
    {
      name: 'Uniswap',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      decimals: 18,
      chainId: 4,
      logoURI: 'ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg',
    },
    {
      name: 'Wrapped Ether',
      address: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
      symbol: 'WETH',
      decimals: 18,
      chainId: 4,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc778417E063141139Fce010982780140Aa0cD5Ab/logo.png',
    },
    // UNKNOWN
    {
      name: 'Uniswap',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      decimals: 18,
      chainId: 5,
      logoURI: 'ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg',
    },
    {
      name: 'Wrapped Ether',
      address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      symbol: 'WETH',
      decimals: 18,
      chainId: 5,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6/logo.png',
    },
    // LUKSO Mainnet
    {
      name: 'Dai Stablecoin',
      address: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
      symbol: 'DAI',
      decimals: 18,
      chainId: 42,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa/logo.png',
    },
    {
      name: 'Maker',
      address: '0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD',
      symbol: 'MKR',
      decimals: 18,
      chainId: 42,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD/logo.png',
    },
    {
      name: 'Uniswap',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      decimals: 18,
      chainId: 42,
      logoURI: 'ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg',
    },
    {
      name: 'Wrapped Ether',
      address: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
      symbol: 'WETH',
      decimals: 18,
      chainId: 42,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xd0A1E359811322d97991E03f863a0C30C2cF029C/logo.png',
    },
    // Base Mainnet
    {
      name: 'Synthetix Network Token',
      address: '0x22e6966B799c4D5B13BE962E1D117b56327FDa66',
      symbol: 'SNX',
      decimals: 18,
      chainId: 8453,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png',
    },
    {
      name: 'Coinbase Wrapped Staked ETH',
      address: '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22',
      symbol: 'cbETH',
      decimals: 18,
      chainId: 8453,
      logoURI: '',
    },
    {
      name: 'Renzo Restaked ETH',
      address: '0x2416092f143378750bb29b79eD961ab195CcEea5',
      symbol: 'ezETH',
      decimals: 18,
      chainId: 8453,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xbf5495Efe5DB9ce00f80364C8B423567e58d2110/logo.png',
    },
    {
      name: 'Wrapped eETH',
      address: '0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A',
      symbol: 'weETH',
      decimals: 18,
      chainId: 8453,
      logoURI: '',
    },
    {
      name: 'Dai Stablecoin',
      address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
      symbol: 'DAI',
      decimals: 18,
      chainId: 8453,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    },
    {
      name: 'Wrapped Ether',
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      decimals: 18,
      chainId: ChainFamilyMap.Base.Base.chainId,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    },
    {
      name: 'Ether',
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      symbol: 'ETH',
      decimals: 18,
      chainId: ChainFamilyMap.Base.Base.chainId,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    },
    {
      name: 'Ether',
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      symbol: 'ETH',
      decimals: 18,
      chainId: ChainFamilyMap.Arbitrum.ArbitrumOne.chainId,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    },
    {
      name: 'Wrapped Ether',
      address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      symbol: 'WETH',
      decimals: 18,
      chainId: ChainFamilyMap.Arbitrum.ArbitrumOne.chainId,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    },
    {
      chainId: 8453,
      address: '0x9EaF8C1E34F05a589EDa6BAfdF391Cf6Ad3CB239',
      name: 'yearn finance',
      symbol: 'YFI',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/11849/thumb/yfi-192x192.png?1598325330',
    },
    {
      address: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
      chainId: 8453,
      name: 'WrappedliquidstakedEther2.0',
      symbol: 'wstETH',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png',
    },
    {
      address: '0x5979d7b546e38e414f7e9822514be443a4800529',
      chainId: ChainFamilyMap.Arbitrum.ArbitrumOne.chainId,
      name: 'WrappedliquidstakedEther2.0',
      symbol: 'wstETH',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png',
    },
    {
      name: 'Rocket ETH',
      address: '0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c',
      symbol: 'rETH',
      decimals: 18,
      chainId: 8453,
      logoURI: 'https://tokens.1inch.io/0xae78736cd615f374d3085123a210448e74fc6393.png',
    },
    {
      chainId: 8453,
      symbol: 'USDC',
      name: 'USDCoin',
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      decimals: 6,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    },
    {
      chainId: ChainFamilyMap.Arbitrum.ArbitrumOne.chainId,
      symbol: 'USDC',
      name: 'USDCoin',
      address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
      decimals: 6,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    },
    {
      chainId: ChainFamilyMap.Arbitrum.ArbitrumOne.chainId,
      symbol: 'USDC.e',
      name: 'Bridged USDCoin',
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      decimals: 6,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    },
    {
      chainId: 8453,
      symbol: 'BSDETH',
      name: 'Based ETH',
      address: '0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff',
      decimals: 18,
      logoURI: '',
    },
    // LBTC
    {
      chainId: 1,
      symbol: 'LBTC',
      name: 'Lombard Staked BTC',
      address: '0x8236a87084f8b84306f72007f36f2618a5634494',
      decimals: 8,
      logoURI: '',
    },
    // SWBTC
    {
      chainId: 1,
      symbol: 'SWBTC',
      name: 'Swell Restaked BTC',
      address: '0x8db2350d78abc13f5673a411d4700bcf87864dde',
      decimals: 8,
      logoURI: '',
    },
    // rswETH
    {
      chainId: 1,
      symbol: 'rswETH',
      name: 'Restaked Swell ETH',
      address: '0xfae103dc9cf190ed75350761e95403b7b8afa6c0',
      decimals: 18,
      logoURI: '',
    },
    // WOETH
    {
      chainId: 1,
      symbol: 'WOETH',
      name: 'Wrapped OETH',
      address: '0xdcee70654261af21c44c093c300ed3bb97b78192',
      decimals: 18,
      logoURI: '',
    },
    // tBTC
    {
      chainId: 1,
      symbol: 'tBTC',
      name: 'tBTC',
      address: '0x18084fbA666a33d37592fA2633fD49a74DD93a88',
      decimals: 18,
      logoURI: '',
    },
    // cbBTC
    {
      chainId: 1,
      symbol: 'cbBTC',
      name: 'Coinbase Wrapped BTC',
      address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
      decimals: 8,
      logoURI: '',
    },
    // USDS
    {
      chainId: 1,
      symbol: 'USDS',
      name: 'USD Sky',
      address: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
      decimals: 18,
      logoURI: '',
    },
    // rsETH
    {
      chainId: 1,
      symbol: 'rsETH',
      name: 'Kelp DAO Restaked ETH',
      address: '0xa1290d69c65a6fe4df752f95823fae25cb99e5a7',
      decimals: 18,
      logoURI: '',
    },
    {
      chainId: 8453,
      symbol: 'USDbC',
      name: 'Bridged USDC (Base)',
      address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
      decimals: 6,
      logoURI: '',
    },
    {
      chainId: 1,
      symbol: 'mBASIS',
      name: 'Midas Basis Trading Token',
      address: '0x2a8c22E3b10036f3AEF5875d04f8441d4188b656',
      decimals: 18,
      logoURI: '',
    },
    // take from config json deployments
    {
      chainId: ChainFamilyMap.Base.Base.chainId,
      symbol: 'SUMMER',
      name: 'SummerToken',
      address: '0x52A94964b494A4dc6912A10949f88c0770E0a514',
      decimals: 18,
      logoURI: '',
    },
    {
      chainId: ChainFamilyMap.Arbitrum.ArbitrumOne.chainId,
      symbol: 'SUMMER',
      name: 'SummerToken',
      address: '0xc4E635b196Fb8B1f0AB58Ec3cCC73e79188741a0',
      decimals: 18,
      logoURI: '',
    },
    {
      chainId: ChainFamilyMap.Ethereum.Mainnet.chainId,
      symbol: 'SUMMER',
      name: 'SummerToken',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      logoURI: '',
    },
  ],
}
