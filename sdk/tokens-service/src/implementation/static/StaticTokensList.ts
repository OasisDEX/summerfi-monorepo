import { ChainFamilyMap, ChainIds } from '@summerfi/sdk-common'
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
      name: 'ether.fi BTC',
      address: '0x657e8c867d8b37dcc18fa4caead9c45eb088c642',
      symbol: 'EBTC',
      decimals: 8,
      chainId: 1,
      logoURI: 'https://etherscan.io/token/images/eBTC_32.png',
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
      name: 'Ether',
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      symbol: 'ETH',
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
      name: 'USD₮0',
      address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      symbol: 'USD₮0',
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
      name: 'Renzo Restaked ETH',
      address: '0x2416092f143378750bb29b79eD961ab195CcEea5',
      symbol: 'ezETH',
      decimals: 18,
      chainId: ChainFamilyMap.Arbitrum.ArbitrumOne.chainId,
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

    // add new tokens same format as above
    // 0x13ad51ed4f1b7e9dc168d8a00cb3f4ddd85efa60	42161	18	LDO	Lido DAO Token	https://tokens.1inch.io/0x13ad51ed4f1b7e9dc168d8a00cb3f4ddd85efa60.png
    {
      name: 'Lido DAO Token',
      address: '0x13ad51ed4f1b7e9dc168d8a00cb3f4ddd85efa60',
      symbol: 'LDO',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://tokens.1inch.io/0x13ad51ed4f1b7e9dc168d8a00cb3f4ddd85efa60.png',
    },
    // 0x2e9a6df78e42a30712c10a9dc4b1c8656f8f2879	42161	18	MKR	Maker	https://tokens.1inch.io/0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2.png
    {
      name: 'Maker',
      address: '0x2e9a6df78e42a30712c10a9dc4b1c8656f8f2879',
      symbol: 'MKR',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://tokens.1inch.io/0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2.png',
    },
    // 0x354a6da3fcde098f8389cad84b0182725c6c91de	42161	18	COMP	Compound	https://tokens.1inch.io/0xc00e94cb662c3520282e6f5717214004a7f26888.png
    {
      name: 'Compound',
      address: '0x354a6da3fcde098f8389cad84b0182725c6c91de',
      symbol: 'COMP',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://tokens.1inch.io/0xc00e94cb662c3520282e6f5717214004a7f26888.png',
    },
    // 0x35751007a407ca6feffe80b3cb397736d2cf4dbe	42161	18	weETH	Wrapped eETH	https://tokens-data.1inch.io/images/42161/0x35751007a407ca6feffe80b3cb397736d2cf4dbe_0xc9299da210e6d68839b21e6e218dd397395eafaa6b2b11b3e9035b49418be043.png
    {
      name: 'Wrapped eETH',
      address: '0x35751007a407ca6feffe80b3cb397736d2cf4dbe',
      symbol: 'weETH',
      decimals: 18,
      chainId: 42161,
      logoURI:
        'https://tokens-data.1inch.io/images/42161/0x35751007a407ca6feffe80b3cb397736d2cf4dbe_0xc9299da210e6d68839b21e6e218dd397395eafaa6b2b11b3e9035b49418be043.png',
    },
    //  0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34	42161	18	USDe	USDe	https://tokens-data.1inch.io/images/42161/0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34.webp
    {
      name: 'USDe',
      address: '0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34',
      symbol: 'USDe',
      decimals: 18,
      chainId: 42161,
      logoURI:
        'https://tokens-data.1inch.io/images/42161/0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34.webp',
    },
    // 0x912ce59144191c1204e64559fe8253a0e49e6548	42161	18	ARB	Arbitrum	https://tokens.1inch.io/0x912ce59144191c1204e64559fe8253a0e49e6548.png
    {
      name: 'Arbitrum',
      address: '0x912ce59144191c1204e64559fe8253a0e49e6548',
      symbol: 'ARB',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://tokens.1inch.io/0x912ce59144191c1204e64559fe8253a0e49e6548.png',
    },
    // 0xba5ddd1f9d7f570dc94a51479a000e3bce967196	42161	18	AAVE	Aave	https://tokens-data.1inch.io/images/42161/0xba5ddd1f9d7f570dc94a51479a000e3bce967196.webp
    {
      name: 'Aave',
      address: '0xba5ddd1f9d7f570dc94a51479a000e3bce967196',
      symbol: 'AAVE',
      decimals: 18,
      chainId: 42161,
      logoURI:
        'https://tokens-data.1inch.io/images/42161/0xba5ddd1f9d7f570dc94a51479a000e3bce967196.webp',
    },
    // 0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf	42161	8	cbBTC	Coinbase Wrapped BTC	https://tokens-data.1inch.io/images/42161/0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf.webp
    {
      name: 'Coinbase Wrapped BTC',
      address: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
      symbol: 'cbBTC',
      decimals: 8,
      chainId: 42161,
      logoURI:
        'https://tokens-data.1inch.io/images/42161/0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf.webp',
    },
    // 0xd74f5255d557944cf7dd0e45ff521520002d5748	42161	18	USDs	Sperax USD	https://tokens.1inch.io/0xd74f5255d557944cf7dd0e45ff521520002d5748.png
    {
      name: 'Sperax USD',
      address: '0xd74f5255d557944cf7dd0e45ff521520002d5748',
      symbol: 'USDs',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://tokens.1inch.io/0xd74f5255d557944cf7dd0e45ff521520002d5748.png',
    },
    // 0xda10009cbd5d07dd0cecc66161fc93d7c9000da1	42161	18	DAI	Dai Stablecoin	https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png
    {
      name: 'Dai Stablecoin',
      address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
      symbol: 'DAI',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
    },
    // 0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8	42161	18	rETH	Rocket Pool ETH	https://tokens.1inch.io/0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8.png
    {
      name: 'Rocket Pool ETH',
      address: '0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8',
      symbol: 'rETH',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://tokens.1inch.io/0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8.png',
    },
    // 0xf97f4df75117a78c1a5a0dbb814af92458539fb4	42161	18	LINK	ChainLink Token	https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png
    {
      name: 'ChainLink Token',
      address: '0xf97f4df75117a78c1a5a0dbb814af92458539fb4',
      symbol: 'LINK',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png',
    },
    // 0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0	42161	18	UNI	Uniswap	https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png
    {
      name: 'Uniswap',
      address: '0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0',
      symbol: 'UNI',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png',
    },
    // 0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2	8453	18	sUSDe	Staked USDe
    {
      name: 'Staked USDe',
      address: '0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2',
      symbol: 'sUSDe',
      decimals: 18,
      chainId: 8453,
      logoURI: '',
    },
    // 0x236aa50979d5f3de3bd1eeb40e81137f22ab794b	8453	18	tBTC	tBTC	https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0x18084fbA666a33d37592fA2633fD49a74DD93a88/logo.png
    {
      name: 'tBTC',
      address: '0x236aa50979d5f3de3bd1eeb40e81137f22ab794b',
      symbol: 'tBTC',
      decimals: 18,
      chainId: 8453,
      logoURI:
        'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0x18084fbA666a33d37592fA2633fD49a74DD93a88/logo.png',
    },
    // 0x820c137fa70c8691f0e44dc420a5e53c168921dc	8453	18	USDS	USDS Stablecoin	https://tokens-data.1inch.io/images/8453/0x820c137fa70c8691f0e44dc420a5e53c168921dc_0x51a2f77153cdea2e4aa8bc8ab5469e949f765df8b1daa448f1ce29d29faaf0e7.png
    {
      name: 'USDS Stablecoin',
      address: '0x820c137fa70c8691f0e44dc420a5e53c168921dc',
      symbol: 'USDS',
      decimals: 18,
      chainId: 8453,
      logoURI:
        'https://tokens-data.1inch.io/images/8453/0x820c137fa70c8691f0e44dc420a5e53c168921dc_0x51a2f77153cdea2e4aa8bc8ab5469e949f765df8b1daa448f1ce29d29faaf0e7.png',
    },
    // 0x982f2df63fe38ab8d55f4b1464e8cfdc8ea5dec8	8453	18	sUSDS	Savings USDS	https://tokens-data.1inch.io/images/8453/0x982f2df63fe38ab8d55f4b1464e8cfdc8ea5dec8_0xc96b3b4c269e226d404e04a3538ab98af6a88a4db8ca856eb650e765973db6e7.svg
    {
      name: 'Savings USDS',
      address: '0x982f2df63fe38ab8d55f4b1464e8cfdc8ea5dec8',
      symbol: 'sUSDS',
      decimals: 18,
      chainId: 8453,
      logoURI:
        'https://tokens-data.1inch.io/images/8453/0x982f2df63fe38ab8d55f4b1464e8cfdc8ea5dec8_0xc96b3b4c269e226d404e04a3538ab98af6a88a4db8ca856eb650e765973db6e7.svg',
    },
    // 0x9e1028f5f1d5ede59748ffcee5532509976840e0	8453	18	COMP	Compound	https://ethereum-optimism.github.io/data/COMP/logo.svg
    {
      name: 'Compound',
      address: '0x9e1028f5f1d5ede59748ffcee5532509976840e0',
      symbol: 'COMP',
      decimals: 18,
      chainId: 8453,
      logoURI: 'https://ethereum-optimism.github.io/data/COMP/logo.svg',
    },
    // 0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842	8453	18	MORPHO	Morpho Token	https://tokens-data.1inch.io/images/8453/0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842_0xd18e9e5389702605395fffb94abd4f826aea2adbdc440bd890b21ef529e73df0.png
    {
      name: 'Morpho Token',
      address: '0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842',
      symbol: 'MORPHO',
      decimals: 18,
      chainId: 8453,
      logoURI:
        'https://tokens-data.1inch.io/images/8453/0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842_0xd18e9e5389702605395fffb94abd4f826aea2adbdc440bd890b21ef529e73df0.png',
    },
    // 0xc3de830ea07524a0761646a6a4e4be0e114a3c83	8453	18	UNI	Uniswap	https://tokens-data.1inch.io/images/8453/0xc3de830ea07524a0761646a6a4e4be0e114a3c83_0x35e495b3fdd8ca6b2250efb5826bed8c9a9c0a4cb8c614277e2c8f421488631b.webp
    {
      name: 'Uniswap',
      address: '0xc3de830ea07524a0761646a6a4e4be0e114a3c83',
      symbol: 'UNI',
      decimals: 18,
      chainId: 8453,
      logoURI:
        'https://tokens-data.1inch.io/images/8453/0xc3de830ea07524a0761646a6a4e4be0e114a3c83_0x35e495b3fdd8ca6b2250efb5826bed8c9a9c0a4cb8c614277e2c8f421488631b.webp',
    },
    // 0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf	8453	8	cbBTC	Coinbase Wrapped BTC	https://tokens-data.1inch.io/images/8453/0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf.webp
    {
      name: 'Coinbase Wrapped BTC',
      address: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
      symbol: 'cbBTC',
      decimals: 8,
      chainId: 8453,
      logoURI:
        'https://tokens-data.1inch.io/images/8453/0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf.webp',
    },
    // Chain 1: 0x35d8949372d46b7a3d5a56006ae77b215fc69bc0	1	18	USD0++	USD0 Liquid Bond	https://tokens-data.1inch.io/images/1/0x35d8949372d46b7a3d5a56006ae77b215fc69bc0_0x2ad133adf158a931068460691a739b4c793ef1560db6496cc1222091dbb255e3.png
    {
      name: 'USD0 Liquid Bond',
      address: '0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
      symbol: 'USD0++',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://tokens-data.1inch.io/images/1/0x35d8949372d46b7a3d5a56006ae77b215fc69bc0_0x2ad133adf158a931068460691a739b4c793ef1560db6496cc1222091dbb255e3.png',
    },
    // Chain 1: 0x56072c95faa701256059aa122697b133aded9279	1	18	SKY	SKY Governance Token	https://tokens-data.1inch.io/images/1/0x56072c95faa701256059aa122697b133aded9279.png
    {
      name: 'SKY Governance Token',
      address: '0x56072c95faa701256059aa122697b133aded9279',
      symbol: 'SKY',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://tokens-data.1inch.io/images/1/0x56072c95faa701256059aa122697b133aded9279.png',
    },
    // Chain 1: 0x57e114b691db790c35207b2e685d4a43181e6061	1	18	ENA	ENA	https://tokens.1inch.io/0x57e114b691db790c35207b2e685d4a43181e6061.png
    {
      name: 'ENA',
      address: '0x57e114b691db790c35207b2e685d4a43181e6061',
      symbol: 'ENA',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://tokens.1inch.io/0x57e114b691db790c35207b2e685d4a43181e6061.png',
    },
    // Chain 1: 0x58d97b57bb95320f9a05dc918aef65434969c2b2	1	18	MORPHO	Morpho Token	https://tokens-data.1inch.io/images/1/0x58d97b57bb95320f9a05dc918aef65434969c2b2.png
    {
      name: 'Morpho Token',
      address: '0x58d97b57bb95320f9a05dc918aef65434969c2b2',
      symbol: 'MORPHO',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://tokens-data.1inch.io/images/1/0x58d97b57bb95320f9a05dc918aef65434969c2b2.png',
    },
    // Chain 1: 0x6982508145454ce325ddbe47a25d4ec3d2311933	1	18	PEPE	Pepe	https://tokens.1inch.io/0x6982508145454ce325ddbe47a25d4ec3d2311933.png
    {
      name: 'Pepe',
      address: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
      symbol: 'PEPE',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://tokens.1inch.io/0x6982508145454ce325ddbe47a25d4ec3d2311933.png',
    },
    // Chain 1: 0x73a15fed60bf67631dc6cd7bc5b6e8da8190acf5	1	18	USD0	Usual USD	https://tokens-data.1inch.io/images/1/0x73a15fed60bf67631dc6cd7bc5b6e8da8190acf5_0xf5e73a54247dc9aeb70a9faf2f1ec9989c161245c2913132c2c0ad2900d05a13.png
    {
      name: 'Usual USD',
      address: '0x73a15fed60bf67631dc6cd7bc5b6e8da8190acf5',
      symbol: 'USD0',
      decimals: 18,
      chainId: 1,
      logoURI:
        'https://tokens-data.1inch.io/images/1/0x73a15fed60bf67631dc6cd7bc5b6e8da8190acf5_0xf5e73a54247dc9aeb70a9faf2f1ec9989c161245c2913132c2c0ad2900d05a13.png',
    },
    // Chain 1: 0xb50721bcf8d664c30412cfbc6cf7a15145234ad1	1	18	ARB	Arbitrum	https://tokens.1inch.io/0xb50721bcf8d664c30412cfbc6cf7a15145234ad1.png
    {
      name: 'Arbitrum',
      address: '0xb50721bcf8d664c30412cfbc6cf7a15145234ad1',
      symbol: 'ARB',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://tokens.1inch.io/0xb50721bcf8d664c30412cfbc6cf7a15145234ad1.png',
    },
    // Chain 1: 0xc00e94cb662c3520282e6f5717214004a7f26888	1	18	COMP	Compound	https://tokens.1inch.io/0xc00e94cb662c3520282e6f5717214004a7f26888.png
    {
      name: 'Compound',
      address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
      symbol: 'COMP',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://tokens.1inch.io/0xc00e94cb662c3520282e6f5717214004a7f26888.png',
    },
    // aero 0x940181a94a35a4569e4529a3cdfb74e38fd98631
    {
      name: 'Aerodrome Finance',
      address: '0x940181a94a35a4569e4529a3cdfb74e38fd98631',
      symbol: 'AERO',
      decimals: 18,
      chainId: 8453,
      logoURI: 'https://tokens.1inch.io/0x940181a94a35a4569e4529a3cdfb74e38fd98631.png',
    },
    {
      name: 'EURC',
      address: '0x1abaea1f7c830bd89acc67ec4af516284b1bc33c',
      symbol: 'EURC',
      decimals: 6,
      chainId: ChainFamilyMap.Ethereum.Mainnet.chainId,
      logoURI: 'https://tokens.1inch.io/0x1abaea1f7c830bd89acc67ec4af516284b1bc33c.png',
    },
    {
      name: 'EURC',
      address: '0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42',
      symbol: 'EURC',
      decimals: 6,
      chainId: ChainFamilyMap.Base.Base.chainId,
      logoURI: 'https://tokens.1inch.io/0x1abaea1f7c830bd89acc67ec4af516284b1bc33c.png',
    },
    {
      name: 'Bridged USDC',
      address: '0x29219dd400f2bf60e5a23d13be72b486d4038894',
      symbol: 'USDC.e',
      decimals: 6,
      chainId: ChainIds.Sonic,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    },
    // another instance of USDC on sonic, with the same address but different symbol to ease handling
    // since 3rd party usually refer to USDC on sonic as USDC instead of USDC.e
    {
      name: 'Bridged USDC',
      address: '0x29219dd400f2bf60e5a23d13be72b486d4038894',
      symbol: 'USDC',
      decimals: 6,
      chainId: ChainIds.Sonic,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    },
    {
      name: 'Wrapped Ether',
      address: '0x50c42deacd8fc9773493ed674b675be577f2634b',
      symbol: 'WETH',
      decimals: 18,
      chainId: ChainIds.Sonic,
      logoURI: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png?1595348880',
    },
    {
      name: 'Wrapped Sonic',
      address: '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38', // Wrapped Sonic (wS) address
      symbol: 'WS',
      decimals: 18,
      chainId: ChainIds.Sonic,
      logoURI:
        'https://assets.coingecko.com/coins/images/38108/standard/200x200_Sonic_Logo.png?1734679256',
    },
    // SUMR
    {
      name: 'SummerToken',
      address: '0x194f360D130F2393a5E9F3117A6a1B78aBEa1624',
      symbol: 'SUMR',
      decimals: 18,
      chainId: ChainIds.ArbitrumOne,
      logoURI: '',
    },
    {
      name: 'SummerToken',
      address: '0x194f360D130F2393a5E9F3117A6a1B78aBEa1624',
      symbol: 'SUMR',
      decimals: 18,
      chainId: ChainIds.Base,
      logoURI: '',
    },
    {
      name: 'SummerToken',
      address: '0x194f360D130F2393a5E9F3117A6a1B78aBEa1624',
      symbol: 'SUMR',
      decimals: 18,
      chainId: ChainIds.Mainnet,
      logoURI: '',
    },
    {
      name: 'SummerToken',
      address: '0x4e0037f487bBb588bf1B7a83BDe6c34FeD6099e3',
      symbol: 'SUMR',
      decimals: 18,
      chainId: ChainIds.Sonic,
      logoURI: '',
    },
    // BUMMER
    {
      name: 'BummerToken',
      address: '0x8c977a41aDCd7537498a3bC3a0cB30Fb210A247A',
      symbol: 'BUMMER',
      decimals: 18,
      chainId: ChainIds.ArbitrumOne,
      logoURI: '',
    },
    {
      name: 'BummerToken',
      address: '0x932CCb7D2A6F1821a1Ecee9e1279aC30E0d4db32',
      symbol: 'BUMMER',
      decimals: 18,
      chainId: ChainIds.Base,
      logoURI: '',
    },
    {
      name: 'BummerToken',
      address: '0x887482d43792330Bf42C20154d11B0c308aFb4bc',
      symbol: 'BUMMER',
      decimals: 18,
      chainId: ChainIds.Mainnet,
      logoURI: '',
    },
    {
      name: 'BummerToken',
      address: '0xe8e6e06F9D33C4030e24b98ca7b000B76DF74845',
      symbol: 'BUMMER',
      decimals: 18,
      chainId: ChainIds.Sonic,
      logoURI: '',
    },
    {
      name: 'Sonic',
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      symbol: 'S',
      decimals: 18,
      chainId: ChainIds.Sonic,
      logoURI:
        'https://assets.coingecko.com/coins/images/38108/standard/200x200_Sonic_Logo.png?1734679256',
    },
    {
      name: 'Ripple USD',
      address: '0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD',
      symbol: 'RLUSD',
      decimals: 18,
      chainId: ChainIds.Mainnet,
      logoURI: 'https://tokens.1inch.io/0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD.png',
    },
    {
      name: 'PT Ethereal eUSDE',
      address: '0x50D2C7992b802Eef16c04FeADAB310f31866a545',
      symbol: 'PT-eUSDE-29MAY2025',
      decimals: 18,
      chainId: ChainIds.Mainnet,
      logoURI: 'https://tokens.1inch.io/0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD.png',
    },
    {
      name: 'PT Ethena sUSDE',
      address: '0x3b3fb9c57858ef816833dc91565efcd85d96f634',
      symbol: 'PT-sUSDE-31JUL2025',
      decimals: 18,
      chainId: ChainIds.Mainnet,
      logoURI: 'https://tokens.1inch.io/0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD.png',
    },
  ],
}
