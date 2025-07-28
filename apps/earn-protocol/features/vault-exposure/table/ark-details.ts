import { SDKNetwork } from '@summerfi/app-types'

export const arkDetailsMap: {
  [key in
    | SDKNetwork.ArbitrumOne
    | SDKNetwork.Base
    | SDKNetwork.Mainnet
    | SDKNetwork.SonicMainnet]: {
    [key: string]: { description: string; link?: string }
  }
} = {
  [SDKNetwork.Mainnet]: {
    // ETH Strategies
    '0x1a91e4bc8b5dc910bc58c3ddf35405edb9c2022e': {
      description:
        'Built on time-tested infrastructure, delivering efficient ETH yield optimization with a strong track record of reliability and security.',
      link: 'https://app.aave.com/reserve-overview/?underlyingAsset=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&marketName=proto_mainnet_v3',
    },
    '0x4bd07e9d2ad23a68d232a20f1c8555e0c1573a4b': {
      description:
        'A strategy designed to maximize ETH efficiency while maintaining strict risk controls and prioritizing sustainability.',
      link: 'https://app.morpho.org/ethereum/vault/0xBEEf050ecd6a16c4e7bfFbB52Ebba7846C4b8cD4/steakhouse-eth',
    },
    '0x5093dae3bdcaf136d4dfd684e1fba87a86c21c14': {
      description:
        'A dynamically managed ETH strategy, designed to adapt to market conditions and optimize capital deployment without unnecessary complexity.',
      link: 'https://fluid.instadapp.io/lending/1',
    },
    '0x570957bc84b5607e2412de72461fbbd02844b042': {
      description:
        'A protocol-native ETH strategy with transparent mechanics, deep liquidity, and a structured approach to capital efficiency.',
      link: 'https://app.spark.fi/markets/1/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
    '0x5f32a2eef8e96adf4a9199527255a69ea457c0e9': {
      description:
        'A highly vetted ETH strategy built for resilient yield performance with intelligent allocation and rigorous risk assessment.',
      link: 'https://app.morpho.org/ethereum/vault/0x2371e134e3455e0593363cBF89d3b6cf53740618/gauntlet-weth-prime',
    },
    '0x6d3ef0c74050ba40cef2d2fff34b869aa1e2668f': {
      description:
        'A strategy designed to optimize ETH exposure while prioritizing security, efficiency, and predictable returns.',
      link: 'https://app.gearbox.fi/pools/0xda0002859b2d05f66a753d8241fcde8623f26f4f',
    },
    '0x78bfc6c846ff91f6029f0d94db1c455afbe27d78': {
      description:
        'Engineered for efficient ETH deployment, minimizing unnecessary risks while ensuring capital remains productive.',
      link: 'https://app.euler.finance/vault/0xD8b27CF359b7D15710a5BE299AF6e7Bf904984C2?network=ethereum',
    },
    '0xc991f9dec95e33389132a4d91f71cfe6235acaaf': {
      description:
        'An advanced ETH strategy, built with algorithmic optimization to enhance performance while maintaining risk-adjusted stability.',
      link: 'https://app.morpho.org/ethereum/vault/0x78Fc2c2eD1A4cDb5402365934aE5648aDAd094d0/re7-weth',
    },
    '0xcc9691be0b06f98803585c308d20aa0497dac88c': {
      description:
        'A streamlined ETH strategy, focused on maximizing efficiency with minimal exposure to volatility and structural inefficiencies.',
      link: 'https://app.compound.finance/?market=usdc-mainnet',
    },
    '0xde1f07a76da86e9480c65b0344d978ee85c778f0': {
      description:
        'The buffer is a portion of a vault that is not held in any one particular strategy and stands ready to be deployed to capitalize on any new strategies that may arise.',
    },
    '0xe2d4075734dba76d5d17cd3fec8401f521522c34': {
      description:
        'Engineered for efficient ETH deployment, minimizing unnecessary risks while ensuring capital remains productive.',
      link: 'https://app.euler.finance/vault/0xD8b27CF359b7D15710a5BE299AF6e7Bf904984C2?network=ethereum',
    },
    '0x0f7c5a02f0763b2806cae1bc7e965dae089322da': {
      description:
        'Engineered for efficient ETH deployment, minimizing unnecessary risks while ensuring capital remains productive.',
      link: 'https://app.euler.finance/vault/0x716bF454066a84F39A2F78b5707e79a9d64f1225?network=ethereum',
    },
    '0x7e29e6503df46d4060301c1b4317adf2a6d6d371': {
      description:
        'An advanced ETH strategy, built with algorithmic optimization to enhance performance while maintaining risk-adjusted stability.',
      link: 'https://app.morpho.org/base/vault/0x6b13c060F13Af1fdB319F52315BbbF3fb1D88844/gauntlet-weth-core',
    },
    '0x4aa2b5d3a044aae29afbb90800e13382a295f63e': {
      description:
        'The MEVCap WETH Morpho vault, managed by MEV Capital, is designed to optimize risk-adjusted returns by lending wrapped ETH (wETH) against a curated selection of Liquid Staking Tokens (LSTs) and Liquid Restaking Tokens (LRTs) used as collateral on the Ethereum network.',
      link: 'https://app.morpho.org/ethereum/vault/0x9a8bC3B04b7f3D87cfC09ba407dCED575f2d61D8/mev-capital-weth',
    },
    '0x88e7b6f36ec5bb35f802f11d5807401e1f0073a2': {
      description:
        'The buffer is a portion of a vault that is not held in any one particular strategy and stands ready to be deployed to capitalize on any new strategies that may arise.',
    },
    '0xeb60a8e747d73c58ccc320bcdabb166f8a0c0d9d': {
      description:
        'The buffer is a portion of a vault that is not held in any one particular strategy and stands ready to be deployed to capitalize on any new strategies that may arise.',
    },
    '0x5982d78ab5f7ed0e7d3feb08fddd1daab15212cc': {
      description:
        'An advanced ETH strategy, leveraging algorithmic efficiency to enhance returns while maintaining risk-conscious exposure.',
      link: 'https://app.morpho.org/ethereum/vault/0x78Fc2c2eD1A4cDb5402365934aE5648aDAd094d0/re7-weth',
    },
    '0x10ef55e974c18ce0ed9105868fff412752fed951': {
      description:
        'A dynamically managed ETH strategy, adjusting to market conditions in real time to ensure optimal capital performance.',
      link: 'https://fluid.instadapp.io/lending/1',
    },

    // USDT Strategies
    '0x26c50781f592cf4c7389615a38dc927c81f8a0a4': {
      description:
        'A strategy designed to ensure capital efficiency while reducing unnecessary exposure to volatility or structural risks.',
      link: 'https://app.morpho.org/ethereum/vault/0xA0804346780b4c2e3bE118ac957D1DB82F9d7484/smokehouse-usdt',
    },
    '0x2d0afbf4f6bb188638e281c430eded5610f0af14': {
      description:
        'A USDT strategy focused on efficient capital deployment, maintaining strong security while optimizing returns.',
      link: 'https://app.euler.finance/vault/0x313603FA690301b0CaeEf8069c065862f9162162?network=ethereum',
    },
    '0x4b7752b3ee55c792784b5431c98d4bdb25d49728': {
      description:
        'An optimized USDT strategy that prioritizes efficient capital utilization while avoiding unnecessary complexity.',
      link: 'https://app.gearbox.fi/pools/0x05a811275fe9b4de503b3311f51edf6a856d936e',
    },
    '0x593f7246c38a6f1ad34add932d6274b846f367e6': {
      description:
        'A structured USDT strategy, ensuring measured risk exposure while delivering consistent yield performance.',
      link: 'https://app.compound.finance/markets/usdt-mainnet',
    },
    '0x5da1c579175dd284106ccac84d0f4e614a93cb66': {
      description:
        'A USDT strategy designed to optimize returns with transparent mechanics and a focus on long-term efficiency.',
      link: 'https://app.euler.finance/vault/0x7c280DBDEf569e96c7919251bD2B0edF0734C5A8?network=ethereum',
    },
    '0x650012ba5369d051e381435e8161454c1a0fcbdc': {
      description:
        'A capital-efficient USDT strategy, ensuring optimal exposure while maintaining a strict focus on sustainability.',
      link: 'https://app.morpho.org/ethereum/vault/0xA0804346780b4c2e3bE118ac957D1DB82F9d7484/smokehouse-usdt',
    },
    '0x66d635171b5760fd28e41a2f8e4b926c64720542': {
      description:
        'A top-tier USDT strategy, built for efficiency, long-term resilience, and reduced exposure to unnecessary risks.',
      link: 'https://app.morpho.org/ethereum/vault/0x2C25f6C25770fFEC5959D34B94Bf898865e5D6b1/flagship-usdt',
    },
    '0x6a60336bc45ae0c9aabae13acc4bcc0cbd962e44': {
      description:
        'An adaptive USDT strategy, designed to ensure consistent performance without unnecessary complexity.',
      link: 'https://fluid.instadapp.io/lending/1',
    },
    '0xa4a6bd19fff5d7b9772e1967b2f53f94924e6c1c': {
      description:
        'A widely adopted USDT strategy, known for its transparent mechanics, strong infrastructure, and efficient capital deployment.',
      link: 'https://app.aave.com/reserve-overview/?underlyingAsset=0xdac17f958d2ee523a2206206994597c13d831ec7&marketName=proto_mainnet_v3',
    },
    '0xf2425751c945c3ac0fcde9e638ed5a30829c9294': {
      description:
        'An advanced USDT strategy, leveraging algorithmic efficiency to enhance returns while maintaining risk-conscious exposure.',
      link: 'https://app.morpho.org/ethereum/vault/0x95EeF579155cd2C5510F312c8fA39208c3Be01a8/re7-usdt',
    },
    '0xf28b3262e2bb0f11ed25a4c4dc87f7f33dd1b5c5': {
      description:
        'A transparent, protocol-native USDT strategy, offering structured exposure to sustainable, long-term performance.',
      link: 'https://app.spark.fi/markets/1/0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
    '0xfa1f432b93b71a8c3cdc0ac32d18f64c80d0f882': {
      description:
        'A premium USDT strategy built for long-term sustainability, rigorous risk assessment, and intelligent capital allocation.',
      link: 'https://app.morpho.org/ethereum/vault/0xdd0f28e19C1780eb6396170735D45153D261490d/gauntlet-usdc-prime',
    },
    '0x8b43a590cc7f0ffd3593131920b226112d329b0e': {
      description:
        'The buffer is a portion of a vault that is not held in any one particular strategy and stands ready to be deployed to capitalize on any new strategies that may arise.',
    },

    // USDC Strategies
    '0x165d1accc5c6326e7ee4deef75ac3ffc8ce4d79b': {
      description:
        'A structured USDC strategy, optimized for long-term stability and avoiding unnecessary market inefficiencies.',
      link: 'https://app.euler.finance/vault/0xe0a80d35bB6618CBA260120b279d357978c42BCE?network=ethereum',
    },
    '0x1ae10e9425653177282e6054a5c828391a533ac7': {
      description:
        'A capital-efficient USDC strategy, prioritizing structured, risk-adjusted returns over speculative exposure.',
      link: 'https://app.morpho.org/ethereum/vault/0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB/steakhouse-usdc',
    },
    '0x36d0501d07619274a398aff16007337041873a6f': {
      description:
        'An optimized USDC strategy, ensuring efficient capital allocation while reducing unnecessary complexity.',
      link: 'https://app.gearbox.fi/pools/0xda00000035fef4082f78def6a8903bee419fbf8e',
    },
    '0x78f466314b2a69685e464431edf7688cb77de131': {
      description:
        'A core USDC strategy designed for sustainable capital efficiency, structured to avoid unnecessary market risks.',
      link: 'https://app.morpho.org/ethereum/vault/0x8eB67A509616cd6A7c1B3c8C21D48FF57df3d458/gauntlet-usdc-core',
    },
    '0x8948a5f3d24f7a6d50ff36064e8cff33b2af062f': {
      description:
        'A MakerDAO-powered USDC strategy, built for long-term sustainability with a focus on efficiency and resilience.',
      link: 'https://app.spark.fi/markets/1/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    },
    '0x9890c99f504337c3500ac05c267c38dfcd41c3e2': {
      description:
        'A synthetic USDC strategy, engineered for optimized returns while maintaining a structured, risk-conscious approach.',
      link: 'https://app.sky.money/?network=ethereum&widget=savings',
    },
    '0x99d21c9c1d68ce0e9bbf77ae0c965daa3ab02c7e': {
      description:
        'A high-efficiency USDC strategy, designed for stable, long-term performance with proven mechanics.',
      link: 'https://app.morpho.org/ethereum/vault/0x186514400e52270cef3D80e1c6F8d10A75d47344/flagship-usdc',
    },
    '0xb10c29b85e388f3ec1189f8ebc78b3f71408cd34': {
      description:
        'A well-structured USDC strategy that leverages intelligent capital allocation to optimize returns sustainably.',
      link: 'https://app.morpho.org/ethereum/vault/0xdd0f28e19C1780eb6396170735D45153D261490d/gauntlet-usdc-prime',
    },
    '0xb5e9c7ad5bb1e21b12ad62066ff1fb388ebdeb37': {
      description:
        'An advanced USDC strategy, blending algorithmic optimization with risk-adjusted efficiency for long-term stability.',
      link: 'https://app.morpho.org/ethereum/vault/0x60d715515d4411f7F43e4206dc5d4a3677f0eC78/re7-usdc',
    },
    '0xc9dd080c9eccfcdbf379714d84cdc8bd01046ae1': {
      description:
        'A widely adopted USDC strategy, built for consistent returns and structured to minimize inefficiencies.',
      link: 'https://app.aave.com/reserve-overview/?underlyingAsset=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&marketName=proto_mainnet_v3',
    },
    '0xca75e855a33acc44dda9d48578df5df7602b5c35': {
      description:
        'A capital-efficient USDC strategy, focused on structured, risk-adjusted returns with long-term sustainability.',
      link: 'https://app.euler.finance/vault/0xce45EF0414dE3516cAF1BCf937bF7F2Cf67873De?network=ethereum',
    },
    '0xccbd61b6c2fb58da5bbd8937ca25164ef29c1cc4': {
      description:
        'A structured USDC strategy, designed for stable, long-term performance with an emphasis on capital efficiency.',
      link: 'https://app.euler.finance/vault/0x797DD80692c3b2dAdabCe8e30C07fDE5307D48a9?network=ethereum',
    },
    '0xdb6d68d571fbef7d67827844dd800884ea9cc02e': {
      description:
        'A dynamically managed USDC strategy, designed for real-time market optimization while avoiding unnecessary exposure.',
      link: 'https://fluid.instadapp.io/lending/1',
    },
    '0xedc6a603b31391b7d13fba6a721fd4dda401f9ea': {
      description:
        'A streamlined USDC strategy, focused on maximizing efficiency while reducing unnecessary market exposure.',
      link: 'https://app.compound.finance/markets/usdc-mainnet',
    },
    '0xf8db64d39d1c7382fe47de8b72435c7e9dfb2894': {
      description:
        'A sustainable USDC strategy, prioritizing structured exposure and long-term capital efficiency.',
      link: 'https://app.morpho.org/ethereum/vault/0xBEeFFF209270748ddd194831b3fa287a5386f5bC/smokehouse-usdc',
    },
    '0x106cbb1f445f0bffa7894f4199ee940bf7f6dd2b': {
      description:
        'The buffer is a portion of a vault that is not held in any one particular strategy and stands ready to be deployed to capitalize on any new strategies that may arise.',
    },
    '0x0f9da4b515fdab1aec67cfa6a66c24625543f495': {
      description:
        'Dedicated Maple pools accessed via Syrup’s router give direct, ring-fenced exposure to Maple yields; separate smart-contract and legal wrappers keep proceeds and risks fully isolated from Maple’s other lending markets.',
      link: 'https://app.maple.finance/earn',
    },
    '0xf285361059b2c17e4f3c562bd8a1868ce22ae826': {
      description:
        'Built on the fully audited codebase of Origin Dollar, it relies on distributed validator technology and permissionless one-to-one withdrawals to blend beacon-chain staking rewards with additional validator incentives, boosting risk-adjusted yield. At the same time, deep, instant liquidity keeps the token trading virtually one-for-one with Ether, delivering secure, high-return staking with almost no slippage.',
      link: 'https://docs.originprotocol.com/yield-bearing-tokens/oeth',
    },
    '0x60390d9493008153b32fffa4765d21d84875d90e': {
      description:
        'Behind the scenes, Fluid automatically puts your ETH to work in several lending apps (Aave, Compound, Spark, Morpho), borrowing a little extra ETH each time to “loop” the position. This boosts the normal staking yield by roughly 1.5-3×. Everything is bundled into one low-gas transaction, and you can swap your iToken back for your stETH (plus the extra yield) whenever you like.',
      link: 'https://lite.guides.instadapp.io/getting-started/vault-features',
    },
    '0x235dd2d3cfcd5476bd0b9217e9a4839e709a00f6': {
      description:
        "The Summer.fi vault is intended to seamlessly allocate USDC liquidity to blue-chip markets on Term and allocate idle liquidity on Summer.fi's USDC Lower Risk Lazy Summer vault",
      link: 'https://app.term.finance/vaults/0xa9ca4909700505585b1ad2a1579da3b670ffa9c4/1',
    },
    '0xfc53cd3bd3e700ca3154d620c8d8806178dcc166': {
      description:
        'The Smokehouse ETH vault aims to optimize for yield on a wide range of collaterals. Built and curated by one of DeFi’s top risk teams.',
      link: 'https://app.morpho.org/ethereum/vault/0xbEEF36A5C1372F8D7d211527FCE9f83FE02d8A73/smokehouse-eth?subTab=performance',
    },
    '0xd84247a3e0ee8480214a0472d6fbc5c04251404d': {
      description:
        'Bluechip ETH yield on Base; competitive APR with transparent mechanics. Powered by Distributed Validator Technology.',
      link: 'https://docs.originprotocol.com/yield-bearing-tokens/oeth',
    },
    '0x3f9e195a8ee39ed7b4a14a919f4a165c872976e5': {
      description:
        'Dedicated Maple pools accessed via Syrup’s router give direct, ring-fenced exposure to Maple yields; separate smart-contract and legal wrappers keep proceeds and risks fully isolated from Maple’s other lending markets.',
      link: 'https://app.maple.finance/earn',
    },
    '0xd3facda7ed0356f2439f96c3dc378042864f14c6': {
      description:
        'The Gauntlet USDC Frontier Vault targets maximum yield by allocating to potentially higher volatility markets that may face liquidity risks in exchange for greater supplier returns.',
      link: 'https://app.morpho.org/ethereum/vault/0xc582F04d8a82795aa2Ff9c8bb4c1c889fe7b754e/gauntlet-usdc-frontier',
    },
    '0xb9a97499c3a400e70a99ee62babce2b7a6f8fd6d': {
      description:
        'The Relend Boosted USDC vault serves as a Global Liquidity Vault for Relend Network. Users who supply USDC will collect RELEND units and receive additional relending yield. Collateral markets are selected for competitive yield and long term partner alignment.',
      link: 'https://app.morpho.org/ethereum/vault/0x0F359FD18BDa75e9c49bC027E7da59a4b01BF32a/relend-usdc',
    },
    '0x40087b15127791ff55746c4e87e4e4afb88a8aeb': {
      description:
        'The MEV Capital Usual USDC provides a set of liquid collateral markets with an optimized risk-adjusted return through an active rebalancing strategy.',
      link: 'https://app.morpho.org/ethereum/vault/0xd63070114470f685b75B74D60EEc7c1113d33a3D/mev-capital-usdc',
    },
    '0x1bf7ef7ed5ac8285dfe6e538b92364ad095dd1a3': {
      description:
        'Dedicated Maple pools accessed via Syrup’s router give direct, ring-fenced exposure to Maple yields; separate smart-contract and legal wrappers keep proceeds and risks fully isolated from Maple’s other lending markets.',
      link: 'https://app.maple.finance/earn',
    },
    '0x2e890e54495361aa78ada62084478b7c65f88721': {
      description:
        'A USDC vault collateralized by other vaults in the Euler Yield and Euler Prime cluster. Secured by Euler’s blue chip DeFi protocols smart contract code.',
      link: 'https://app.euler.finance/vault/0xe0a80d35bB6618CBA260120b279d357978c42BCE?network=ethereum',
    },
    '0x3d8c278f05f655f26dcbf828c084e5182fd8d409': {
      description:
        'Sky Token Rewards module allows your to earn SKY governance tokens - soon Sky Star tokens, too. It’s non-custodial, so you keep full control of your funds while supporting the Sky ecosystem.',
      link: 'https://sky.money/features#rewards',
    },
    '0x3f289b064cd07e42210a57819908a937bec859e8': {
      description:
        'Wraps USDC into real-yield sUSDC; diversifies protocol risk while earning extra spread.',
      link: 'https://sky.money/features#savings',
    },
    '0x827d166823d9372bb8573fcbb0ee776d82289a28': {
      description:
        'A USDC vault collateralized by other vaults. Secured by Euler’s blue chip DeFi protocols smart contract code.',
      link: 'https://app.euler.finance/vault/0xcBC9B61177444A793B85442D3a953B90f6170b7D?network=ethereum',
    },
    '0x9ad7ea2b4eeb732339b19c5eabf087c6164e80eb': {
      description:
        'Deposits USDC into the Liquidity Layer, pooling and redeploying it across Fluid for maximum capital efficiency and yield under rigorous on-chain risk controls.',
      link: 'https://fluid.io/lending/1',
    },
    '0xb2de822f840a9f1ec160212e14e08749783e0f29': {
      description:
        'A USDC vault collateralized by other vaults in the Euler Yield and Euler Prime cluster. Secured by Euler’s blue chip DeFi protocols smart contract code.',
      link: 'https://app.euler.finance/vault/0xce45EF0414dE3516cAF1BCf937bF7F2Cf67873De?network=ethereum',
    },
    '0xd7038e29f353cc6ac601cfe56af3e1affa80a170': {
      description:
        'Mainnet Silo market with risk curated by Apostro. Collateralized against diverse collateral.',
      link: 'https://v2.silo.finance/vaults/ethereum/0xed9278c5188f37670b33ef3B00729E38260cd5D5?action=deposit',
    },
    '0xfd899321b1fd8d75e255119766d9097c98568519': {
      description:
        'USDC goes into a Silo market backed by restaking tokens, staked-stable LPs, yield stables, treasury PTs, and a small WBTC sleeve. Separate caps and oracles fence off each asset, keeping risk isolated while spare capacity preserves stable yields. All curated by Apostro.',
      link: 'https://app.term.finance/vaults/0xa9ca4909700505585b1ad2a1579da3b670ffa9c4/1',
    },
  },
  [SDKNetwork.ArbitrumOne]: {
    '0xc9dd080c9eccfcdbf379714d84cdc8bd01046ae1': {
      description:
        'A stable and transparent USDT strategy, built for efficiency and optimized to deliver long-term, sustainable yield.',
      link: 'https://app.aave.com/reserve-overview/?underlyingAsset=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&marketName=proto_mainnet_v3',
    },
    '0xdb6d68d571fbef7d67827844dd800884ea9cc02e': {
      description:
        'A liquidity-optimized USDT strategy, ensuring capital efficiency without introducing unnecessary complexity or exposure.',
      link: 'https://fluid.instadapp.io/lending/1',
    },
    '0xedc6a603b31391b7d13fba6a721fd4dda401f9ea': {
      description:
        'A structured USDT strategy, designed for stability, capital preservation, and optimized yield distribution.',
      link: 'https://app.compound.finance/markets/usdt-mainnet',
    },
    '0x106cbb1f445f0bffa7894f4199ee940bf7f6dd2b': {
      description:
        'The buffer is a portion of a vault that is not held in any one particular strategy and stands ready to be deployed to capitalize on any new strategies that may arise.',
    },
    '0x699909add8946be934059bfe7e326ffd2cde1db2': {
      description:
        'A dynamically managed USDC strategy, adjusting to market conditions in real time to ensure optimal capital performance.',
      link: 'https://fluid.instadapp.io/lending/1',
    },
    '0x7bb4536e67c804758f77c218d9af28856566151e': {
      description:
        'A structurally efficient USDC strategy, minimizing inefficiencies and optimizing returns through a measured, risk-conscious approach.',
      link: 'https://app.compound.finance/markets/usdc-arb',
    },
    '0xadb5a577caef5bb19e88a2cd6e3e1a8f37e6a41d': {
      description:
        'A strategy designed to optimize USDC exposure while prioritizing security, efficiency, and predictable returns.',
      link: 'https://app.gearbox.fi/pools/0x890a69ef363c9c7bdd5e36eb95ceb569f63acbf6',
    },
    '0xbb79242b9518f450cde8eb957e15c38ab09b1419': {
      description:
        'The buffer is a portion of a vault that is not held in any one particular strategy and stands ready to be deployed to capitalize on any new strategies that may arise.',
    },
    '0x64e3d757d0ea851a79cdc8390c9434a915949461': {
      description:
        'A proven USDC strategy, engineered for consistent performance and structured to reduce exposure to inefficiencies.',
      link: 'https://app.aave.com/reserve-overview/?underlyingAsset=0xaf88d065e77c8cc2239327c5edb3a432268e5831&marketName=proto_arbitrum_v3',
    },
    '0x4ef91e09adb31cc7ec9b663b6827155d6a103b74': {
      description:
        'Converts USDC to interest-bearing sUSDC, powered by Sky, a blue chip DeFi protocol.',
      link: 'https://app.sky.money',
    },
  },
  [SDKNetwork.Base]: {
    '0x165d1accc5c6326e7ee4deef75ac3ffc8ce4d79b': {
      description:
        'A high-efficiency USDC strategy, leveraging tested methodologies to maximize yield while minimizing inefficiencies.',
      link: 'https://app.morpho.org/base/vault/0xeE8F4eC5672F09119b96Ab6fB59C27E1b7e44b61/gauntlet-usdc-prime',
    },
    '0x36d0501d07619274a398aff16007337041873a6f': {
      description:
        'A structured approach to USDC optimization, ensuring transparent exposure to sustainable, risk-adjusted returns.',
      link: 'https://app.sky.money/?network=ethereum&widget=savings',
    },
    '0x78f466314b2a69685e464431edf7688cb77de131': {
      description:
        'A next-generation USDC strategy, using real-time data insights to improve capital efficiency while avoiding unnecessary complexity.',
      link: 'https://app.morpho.org/base/vault/0x12AFDeFb2237a5963e7BAb3e2D46ad0eee70406e/re7-usdc',
    },
    '0x8948a5f3d24f7a6d50ff36064e8cff33b2af062f': {
      description:
        'A protocol-driven USDC strategy, designed for resilience and long-term capital performance with clear mechanics.',
      link: 'https://app.morpho.org/base/vault/0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A/spark-usdc-vault',
    },
    '0xc9dd080c9eccfcdbf379714d84cdc8bd01046ae1': {
      description:
        'A proven USDC strategy, engineered for consistent performance and structured to reduce exposure to inefficiencies.',
      link: 'https://app.aave.com/reserve-overview/?underlyingAsset=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&marketName=proto_mainnet_v3',
    },
    '0xca75e855a33acc44dda9d48578df5df7602b5c35': {
      description:
        'A strategy that prioritizes high-efficiency deployment of USDC while ensuring long-term sustainability and risk management.',
      link: 'https://app.morpho.org/base/vault/0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183/steakhouse-usdc',
    },
    '0xccbd61b6c2fb58da5bbd8937ca25164ef29c1cc4': {
      description:
        'A core USDC strategy, optimized for efficiency and designed to provide sustainable, long-term yield without excessive risk.',
      link: 'https://app.morpho.org/base/vault/0xc0c5689e6f4D256E861F65465b691aeEcC0dEb12/gauntlet-usdc-core',
    },
    '0xdb6d68d571fbef7d67827844dd800884ea9cc02e': {
      description:
        'A dynamically managed USDC strategy, adjusting to market conditions in real time to ensure optimal capital performance.',
      link: 'https://fluid.instadapp.io/lending/1',
    },
    '0xedc6a603b31391b7d13fba6a721fd4dda401f9ea': {
      description:
        'A structurally efficient USDC strategy, minimizing inefficiencies and optimizing returns through a measured, risk-conscious approach.',
      link: 'https://app.compound.finance/markets/usdc-basemainnet',
    },
    '0x106cbb1f445f0bffa7894f4199ee940bf7f6dd2b': {
      description:
        'The buffer is a portion of a vault that is not held in any one particular strategy and stands ready to be deployed to capitalize on any new strategies that may arise.',
    },
    '0x0dd6f8a9dd2b6f1df8dee95eb32f9ad7ba8218c1': {
      description:
        'A core EURC strategy, optimized for efficiency and designed to provide sustainable, long-term yield without excessive risk.',
      link: 'https://app.morpho.org/base/vault/0x1c155be6bC51F2c37d472d4C2Eba7a637806e122/gauntlet-eurc-core',
    },
    '0x67dacdf8ba7025fbea5060e384448af3cc9c362a': {
      description:
        'A proven EURC strategy, engineered for consistent performance and structured to reduce exposure to inefficiencies.',
      link: 'https://app.aave.com/reserve-overview/?underlyingAsset=0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42&marketName=proto_base_v3',
    },
    '0xa3cc259b68eae4d72572756a685fd877e420aa95': {
      description:
        'A top-tier EURC strategy, built for efficiency, long-term resilience, and reduced exposure to unnecessary risks.',
      link: 'https://app.morpho.org/base/vault/0xf24608E0CCb972b0b0f4A6446a0BBf58c701a026/moonwell-flagship-eurc',
    },
    '0xdc736314330e545e7b5db1199e43d6d31bd6802c': {
      description:
        'A dynamically managed EURC strategy, adjusting to market conditions in real time to ensure optimal capital performance.',
      link: 'https://fluid.instadapp.io/lending/1',
    },
    '0xe949e2f45d300e934572bf261428f9261090bef6': {
      description:
        'A top-tier EURC strategy, built for efficiency, long-term resilience, and reduced exposure to unnecessary risks.',
      link: 'https://app.morpho.org/base/vault/0xBeEF086b8807Dc5E5A1740C5E3a7C4c366eA6ab5/steakhouse-eurc',
    },
    '0xc65b7e8fec2b7b329ab1d08c78f9f01fe4e4b3ec': {
      description:
        'The buffer is a portion of a vault that is not held in any one particular strategy and stands ready to be deployed to capitalize on any new strategies that may arise.',
    },
    '0xd9755f1541103333132e2c90c67f7e513060dc0e': {
      description:
        'Bluechip ETH yield on Base; competitive APR with transparent mechanics. Powered by Distributed Validator Technology.',
      link: 'https://docs.originprotocol.com/yield-bearing-tokens/oeth',
    },
    '0x7d3607937fac84aa6d41beb67e252098e52ecd6b': {
      description:
        'The Seamless WETH Vault curated by Gauntlet is intended to optimize risk-adjusted yield across high-demand collateral markets on Base.',
      link: 'https://app.morpho.org/base/vault/0x27D8c7273fd3fcC6956a0B370cE5Fd4A7fc65c18/seamless-weth-vault',
    },
    '0xa510f65c0a1e12ec5b8067f6d614f92cd62e6744': {
      description:
        'The Moonwell Flagship ETH Morpho vault curated by B.Protocol and Block Analitica is intended to optimize risk-adjusted interest earned from blue-chip collateral markets.',
      link: 'https://app.morpho.org/base/vault/0xa0E430870c4604CcfC7B38Ca7845B1FF653D0ff1/moonwell-flagship-eth',
    },
    '0x03b0a0168b51839614f6fb333480d572b754fd56': {
      description:
        'Blue-chip ETH market with deep liquidity and proven risk parameters; core yield anchor.',
      link: 'https://app.aave.com/reserve-overview/?underlyingAsset=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&marketName=proto_base_v3',
    },
    '0xadeb60e50e7bc5e012ddc985b83f8bb24857a002': {
      description:
        'A conservative WETH vault collateralized by other vaults in the Euler Base cluster. Captures variable rates for modest extra volatility.',
      link: 'https://app.euler.finance/vault/0x859160DB5841E5cfB8D3f144C6b3381A85A4b410?network=base',
    },
    '0xb9ac2f768f2adaa65a45988a095988153565a228': {
      description:
        'The Steakhouse ETH vault aims to optimize yields by lending ETH against blue chip crypto and real world asset (RWA) collateral markets.',
      link: 'https://app.morpho.org/ethereum/vault/0xBEEf050ecd6a16c4e7bfFbB52Ebba7846C4b8cD4/steakhouse-eth',
    },
    '0xcc725b576a9570f710e1934e7bf3395bf3250442': {
      description:
        'Battle tested ETH market that balances safety and utilisation-driven yield; low-maintenance position.',
      link: 'https://app.compound.finance/markets/weth-mainnet',
    },
    '0xd29235aed4366c03951cd7dfff1cc77f365ee60f': {
      description:
        'Deposits ETH into the Liquidity Layer, pooling and redeploying it across Fluid for maximum capital efficiency and yield under rigorous on-chain risk controls.',
      link: 'https://fluid.io/lending/1',
    },
    '0xe2ad084b9639ccc689217704577e538ca2c251e5': {
      description:
        'Diversifies into euro-stable; thinner lender base keeps EURC supply rates structurally high.',
      link: 'https://moonwell.fi/markets/borrow/base/eurc',
    },
    '0x78db8603b03337d3c1f53d20283294efa8e7337a': {
      description:
        'The Moonwell Flagship USDC Morpho vault curated by B.Protocol and Block Analitica is intended to optimize risk-adjusted interest earned from blue-chip collateral markets.',
      link: 'https://app.morpho.org/base/vault/0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca/moonwell-flagship-usdc',
    },
    '0xa5d42cf398bd3076ec26da93a8270b8e75b8062c': {
      description:
        'The Seamless USDC Vault curated by Gauntlet is intended to optimize risk-adjusted yield across high-demand collateral markets on Base.',
      link: 'https://app.morpho.org/base/vault/0x616a4E1db48e22028f6bbf20444Cd3b8e3273738/seamless-usdc-vault',
    },
    '0x07e33789cf837b52821c7cded1247938969008ef': {
      description:
        'Large-TVL core pool provides liquidity ballast and steady base rate when peer matches exhaust.',
      link: 'https://moonwell.fi/markets/supply/base/usdc',
    },
  },
  [SDKNetwork.SonicMainnet]: {
    '0x809a0c98fac68a0c4319f3a3e864540c772562af': {
      description:
        'The buffer is a portion of a vault that is not held in any one particular strategy and stands ready to be deployed to capitalize on any new strategies that may arise.',
    },
    '0x4d00d0dc44c4d6352c2bcb2228f2863e48cd53f4': {
      description:
        'Built on time-tested infrastructure, delivering efficient USDC.E yield optimization with a strong track record of reliability and security.',
      link: 'https://app.aave.com/reserve-overview/?underlyingAsset=0x29219dd400f2bf60e5a23d13be72b486d4038894&marketName=proto_sonic_v3',
    },
    '0x3002a7c8d5dc5cfaf81e747120b54d44bfad5935': {
      description:
        'Engineered for efficient USDC.E deployment, minimizing unnecessary risks while ensuring capital remains productive.',
      link: 'https://app.euler.finance/vault/0x3D9e5462A940684073EED7e4a13d19AE0Dcd13bc?network=sonic',
    },
    '0xda50ce93aae2c764532e5b11dc6378af3330a817': {
      description:
        'Engineered for efficient USDC.E deployment, minimizing unnecessary risks while ensuring capital remains productive.',
      link: 'https://app.euler.finance/vault/0x196F3C7443E940911EE2Bb88e019Fd71400349D9?network=sonic',
    },
    '0x5c841955d7ee3e2f7a077aa0aca3a7d724b15da2': {
      description:
        'Engineered for isolated USDC.E deployment on Sonic, balancing yield opportunities with siloed risk controls to protect capital.',
      link: 'https://v2.silo.finance/markets/sonic/s-usdc-20?action=deposit',
    },
    '0x42aade02448fdaf56bbb153b2984e3d53dc531c1': {
      description:
        'Engineered for isolated USDC.E deployment on Sonic, balancing yield opportunities with siloed risk controls to protect capital.',
      link: 'https://v2.silo.finance/markets/sonic/s-usdc-8?action=deposit',
    },
    '0x39c5d327ff8b12649a0a8056ca4499cb27f82fa0': {
      description:
        'Isolated Silo market + Apostro risk oracle for stable USDC-E yield with zero cross asset contagion.',
      link: 'https://v2.silo.finance/earn',
    },
    '0xf67e17c4627e9d9c150b247b6a4e82c01bf36c5f': {
      description:
        'Adds manager diversification inside Sonic; captures incremental lending spread while keeping risk is siloed.',
      link: 'https://v2.silo.finance/earn',
    },
    '0x4c62fc0393393f3a5e455576bda95ccb3e284b19': {
      description:
        'RE7 Labs automates pool rebalancing, boosting capital efficiency for passive USDC-E yield.',
      link: 'https://v2.silo.finance/earn',
    },
  },
}
