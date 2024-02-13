import { MakerConfig } from '@summerfi/deployment-types'

export const MakerConfiguration: MakerConfig = {
  dependencies: {
    FlashMintModule: {
      name: 'FlashMintModule',
      address: '0x60744434d6339a6B27d73d9Eda62b6F66a0a04FA',
      addToRegistry: true,
    },
    Chainlog: {
      name: 'Chainlog',
      address: '0x60744434d6339a6B27d73d9Eda62b6F66a0a04FA',
    },
    CdpManager: {
      name: 'CdpManager',
      address: '0x5ef30b9986345249bc32d8928B7ee64DE9435E39',
    },
    GetCdps: {
      name: 'GetCdps',
      address: '0x36a724Bd100c39f0Ea4D3A20F7097eE01A8Ff573',
    },
    McdJug: {
      name: 'McdJug',
      address: '0x19c0976f590D67707E62397C87829d896Dc0f1F1',
    },
    Pot: {
      name: 'Pot',
      address: '0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7',
    },
    End: {
      name: 'End',
      address: '0xBB856d1742fD182a90239D7AE85706C2FE4e5922',
    },
    Spot: {
      name: 'Spot',
      address: '0x65C79fcB50Ca1594B025960e539eD7A9a6D434A3',
    },
    Dog: {
      name: 'Dog',
      address: '0x135954d155898D42C90D2a57824C690e0c7BEf1B',
    },
    Vat: {
      name: 'Vat',
      address: '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B',
    },
    McdGov: {
      name: 'McdGov',
      address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
    },
    MCD_JOIN_DAI: {
      name: 'MCD_JOIN_DAI',
      address: '0x9759A6Ac90977b93B58547b4A71c78317f391A28',
    },
    MCD_JOIN_ETH_A: {
      name: 'MCD_JOIN_ETH_A',
      address: '0x2F0b23f53734252Bda2277357e97e1517d6B042A',
    },
    MCD_JOIN_ETH_B: {
      name: 'MCD_JOIN_ETH_B',
      address: '0x08638eF1A205bE6762A8b935F5da9b700Cf7322c',
    },
    MCD_JOIN_ETH_C: {
      name: 'MCD_JOIN_ETH_C',
      address: '0xF04a5cC80B1E94C69B48f5ee68a08CD2F09A7c3E',
    },
    MCD_JOIN_BAT_A: {
      name: 'MCD_JOIN_BAT_A',
      address: '0x3D0B1912B66114d4096F48A8CEe3A56C231772cA',
    },
    MCD_JOIN_USDC_A: {
      name: 'MCD_JOIN_USDC_A',
      address: '0xA191e578a6736167326d05c119CE0c90849E84B7',
    },
    MCD_JOIN_USDC_B: {
      name: 'MCD_JOIN_USDC_B',
      address: '0x2600004fd1585f7270756DDc88aD9cfA10dD0428',
    },
    MCD_JOIN_PSM_USDC_A: {
      name: 'MCD_JOIN_PSM_USDC_A',
      address: '0x0A59649758aa4d66E25f08Dd01271e891fe52199',
    },
    MCD_JOIN_WBTC_A: {
      name: 'MCD_JOIN_WBTC_A',
      address: '0xBF72Da2Bd84c5170618Fbe5914B0ECA9638d5eb5',
    },
    MCD_JOIN_WBTC_B: {
      name: 'MCD_JOIN_WBTC_B',
      address: '0xfA8c996e158B80D77FbD0082BB437556A65B96E0',
    },
    MCD_JOIN_WBTC_C: {
      name: 'MCD_JOIN_WBTC_C',
      address: '0x7f62f9592b823331E012D3c5DdF2A7714CfB9de2',
    },
    MCD_JOIN_TUSD_A: {
      name: 'MCD_JOIN_TUSD_A',
      address: '0x4454aF7C8bb9463203b66C816220D41ED7837f44',
    },
    MCD_JOIN_ZRX_A: {
      name: 'MCD_JOIN_ZRX_A',
      address: '0xc7e8Cd72BDEe38865b4F5615956eF47ce1a7e5D0',
    },
    MCD_JOIN_KNC_A: {
      name: 'MCD_JOIN_KNC_A',
      address: '0x475F1a89C1ED844A08E8f6C50A00228b5E59E4A9',
    },
    MCD_JOIN_MANA_A: {
      name: 'MCD_JOIN_MANA_A',
      address: '0xA6EA3b9C04b8a38Ff5e224E7c3D6937ca44C0ef9',
    },
    MCD_JOIN_USDT_A: {
      name: 'MCD_JOIN_USDT_A',
      address: '0x0Ac6A1D74E84C2dF9063bDDc31699FF2a2BB22A2',
    },
    MCD_JOIN_PAXUSD_A: {
      name: 'MCD_JOIN_PAXUSD_A',
      address: '0x7e62B7E279DFC78DEB656E34D6a435cC08a44666',
    },
    MCD_JOIN_PSM_PAX_A: {
      name: 'MCD_JOIN_PSM_PAX_A',
      address: '0x7bbd8cA5e413bCa521C2c80D8d1908616894Cf21',
    },
    MCD_JOIN_COMP_A: {
      name: 'MCD_JOIN_COMP_A',
      address: '0xBEa7cDfB4b49EC154Ae1c0D731E4DC773A3265aA',
    },
    MCD_JOIN_LRC_A: {
      name: 'MCD_JOIN_LRC_A',
      address: '0x6C186404A7A238D3d6027C0299D1822c1cf5d8f1',
    },
    MCD_JOIN_LINK_A: {
      name: 'MCD_JOIN_LINK_A',
      address: '0xdFccAf8fDbD2F4805C174f856a317765B49E4a50',
    },
    MCD_JOIN_BAL_A: {
      name: 'MCD_JOIN_BAL_A',
      address: '0x4a03Aa7fb3973d8f0221B466EefB53D0aC195f55',
    },
    MCD_JOIN_YFI_A: {
      name: 'MCD_JOIN_YFI_A',
      address: '0x3ff33d9162aD47660083D7DC4bC02Fb231c81677',
    },
    MCD_JOIN_GUSD_A: {
      name: 'MCD_JOIN_GUSD_A',
      address: '0xe29A14bcDeA40d83675aa43B72dF07f649738C8b',
    },
    MCD_JOIN_PSM_GUSD_A: {
      name: 'MCD_JOIN_PSM_GUSD_A',
      address: '0x79A0FA989fb7ADf1F8e80C93ee605Ebb94F7c6A5',
    },
    MCD_JOIN_UNI_A: {
      name: 'MCD_JOIN_UNI_A',
      address: '0x3BC3A58b4FC1CbE7e98bB4aB7c99535e8bA9b8F1',
    },
    MCD_JOIN_RENBTC_A: {
      name: 'MCD_JOIN_RENBTC_A',
      address: '0xFD5608515A47C37afbA68960c1916b79af9491D0',
    },
    MCD_JOIN_AAVE_A: {
      name: 'MCD_JOIN_AAVE_A',
      address: '0x24e459F61cEAa7b1cE70Dbaea938940A7c5aD46e',
    },
    MCD_JOIN_MATIC_A: {
      name: 'MCD_JOIN_MATIC_A',
      address: '0x885f16e177d45fC9e7C87e1DA9fd47A9cfcE8E13',
    },
    MCD_JOIN_WSTETH_A: {
      name: 'MCD_JOIN_WSTETH_A',
      address: '0x10CD5fbe1b404B7E19Ef964B63939907bdaf42E2',
    },
    MCD_JOIN_WSTETH_B: {
      name: 'MCD_JOIN_WSTETH_B',
      address: '0x248cCBf4864221fC0E840F29BB042ad5bFC89B5c',
    },
    MCD_JOIN_DIRECT_AAVEV2_DAI: {
      name: 'MCD_JOIN_DIRECT_AAVEV2_DAI',
      address: '0xa13C0c8eB109F5A13c6c90FC26AFb23bEB3Fb04a',
    },
    MCD_JOIN_UNIV2DAIETH_A: {
      name: 'MCD_JOIN_UNIV2DAIETH_A',
      address: '0x2502F65D77cA13f183850b5f9272270454094A08',
    },
    MCD_JOIN_UNIV2WBTCETH_A: {
      name: 'MCD_JOIN_UNIV2WBTCETH_A',
      address: '0xDc26C9b7a8fe4F5dF648E314eC3E6Dc3694e6Dd2',
    },
    MCD_JOIN_UNIV2USDCETH_A: {
      name: 'MCD_JOIN_UNIV2USDCETH_A',
      address: '0x03Ae53B33FeeAc1222C3f372f32D37Ba95f0F099',
    },
    MCD_JOIN_UNIV2DAIUSDC_A: {
      name: 'MCD_JOIN_UNIV2DAIUSDC_A',
      address: '0xA81598667AC561986b70ae11bBE2dd5348ed4327',
    },
    MCD_JOIN_UNIV2ETHUSDT_A: {
      name: 'MCD_JOIN_UNIV2ETHUSDT_A',
      address: '0x4aAD139a88D2dd5e7410b408593208523a3a891d',
    },
    MCD_JOIN_UNIV2LINKETH_A: {
      name: 'MCD_JOIN_UNIV2LINKETH_A',
      address: '0xDae88bDe1FB38cF39B6A02b595930A3449e593A6',
    },
    MCD_JOIN_UNIV2UNIETH_A: {
      name: 'MCD_JOIN_UNIV2UNIETH_A',
      address: '0xf11a98339FE1CdE648e8D1463310CE3ccC3d7cC1',
    },
    MCD_JOIN_UNIV2WBTCDAI_A: {
      name: 'MCD_JOIN_UNIV2WBTCDAI_A',
      address: '0xD40798267795Cbf3aeEA8E9F8DCbdBA9b5281fcC',
    },
    MCD_JOIN_UNIV2AAVEETH_A: {
      name: 'MCD_JOIN_UNIV2AAVEETH_A',
      address: '0x42AFd448Df7d96291551f1eFE1A590101afB1DfF',
    },
    MCD_JOIN_UNIV2DAIUSDT_A: {
      name: 'MCD_JOIN_UNIV2DAIUSDT_A',
      address: '0xAf034D882169328CAf43b823a4083dABC7EEE0F4',
    },
    MCD_JOIN_GUNIV3DAIUSDC1_A: {
      name: 'MCD_JOIN_GUNIV3DAIUSDC1_A',
      address: '0xbFD445A97e7459b0eBb34cfbd3245750Dba4d7a4',
    },
    MCD_JOIN_GUNIV3DAIUSDC2_A: {
      name: 'MCD_JOIN_GUNIV3DAIUSDC2_A',
      address: '0xA7e4dDde3cBcEf122851A7C8F7A55f23c0Daf335',
    },
    MCD_JOIN_CRVV1ETHSTETH_A: {
      name: 'MCD_JOIN_CRVV1ETHSTETH_A',
      address: '0x82D8bfDB61404C796385f251654F6d7e92092b5D',
    },
    MCD_JOIN_RWA001_A: {
      name: 'MCD_JOIN_RWA001_A',
      address: '0x476b81c12Dc71EDfad1F64B9E07CaA60F4b156E2',
    },
    MCD_JOIN_RWA002_A: {
      name: 'MCD_JOIN_RWA002_A',
      address: '0xe72C7e90bc26c11d45dBeE736F0acf57fC5B7152',
    },
    MCD_JOIN_RWA003_A: {
      name: 'MCD_JOIN_RWA003_A',
      address: '0x1Fe789BBac5b141bdD795A3Bc5E12Af29dDB4b86',
    },
    MCD_JOIN_RWA004_A: {
      name: 'MCD_JOIN_RWA004_A',
      address: '0xD50a8e9369140539D1c2D113c4dC1e659c6242eB',
    },
    MCD_JOIN_RWA005_A: {
      name: 'MCD_JOIN_RWA005_A',
      address: '0xA4fD373b93aD8e054970A3d6cd4Fd4C31D08192e',
    },
    MCD_JOIN_RWA006_A: {
      name: 'MCD_JOIN_RWA006_A',
      address: '0x5E11E34b6745FeBa9449Ae53c185413d6EdC66BE',
    },
    MCD_JOIN_RETH_A: {
      name: 'MCD_JOIN_RETH_A',
      address: '0xc6424e862f1462281b0a5fac078e4b63006bdebf',
    },
    MCD_JOIN_GNO_A: {
      name: 'MCD_JOIN_GNO_A',
      address: '0x7bD3f01e24E0f0838788bC8f573CEA43A80CaBB5',
    },
    PIP_ETH: {
      name: 'PIP_ETH',
      address: '0x81FE72B5A8d1A857d176C3E7d5Bd2679A9B85763',
    },
    PIP_BAT: {
      name: 'PIP_BAT',
      address: '0xB4eb54AF9Cc7882DF0121d26c5b97E802915ABe6',
    },
    PIP_USDC: {
      name: 'PIP_USDC',
      address: '0x77b68899b99b686F415d074278a9a16b336085A0',
    },
    PIP_WBTC: {
      name: 'PIP_WBTC',
      address: '0xf185d0682d50819263941e5f4EacC763CC5C6C42',
    },
    PIP_TUSD: {
      name: 'PIP_TUSD',
      address: '0xeE13831ca96d191B688A670D47173694ba98f1e5',
    },
    PIP_ZRX: {
      name: 'PIP_ZRX',
      address: '0x7382c066801E7Acb2299aC8562847B9883f5CD3c',
    },
    PIP_KNC: {
      name: 'PIP_KNC',
      address: '0xf36B79BD4C0904A5F350F1e4f776B81208c13069',
    },
    PIP_MANA: {
      name: 'PIP_MANA',
      address: '0x8067259EA630601f319FccE477977E55C6078C13',
    },
    PIP_USDT: {
      name: 'PIP_USDT',
      address: '0x7a5918670B0C390aD25f7beE908c1ACc2d314A3C',
    },
    PIP_PAXUSD: {
      name: 'PIP_PAXUSD',
      address: '0x043B963E1B2214eC90046167Ea29C2c8bDD7c0eC',
    },
    PIP_PAX: {
      name: 'PIP_PAX',
      address: '0x043B963E1B2214eC90046167Ea29C2c8bDD7c0eC',
    },
    PIP_COMP: {
      name: 'PIP_COMP',
      address: '0xBED0879953E633135a48a157718Aa791AC0108E4',
    },
    PIP_LRC: {
      name: 'PIP_LRC',
      address: '0x9eb923339c24c40Bef2f4AF4961742AA7C23EF3a',
    },
    PIP_LINK: {
      name: 'PIP_LINK',
      address: '0x9B0C694C6939b5EA9584e9b61C7815E8d97D9cC7',
    },
    PIP_BAL: {
      name: 'PIP_BAL',
      address: '0x3ff860c0F28D69F392543A16A397D0dAe85D16dE',
    },
    PIP_YFI: {
      name: 'PIP_YFI',
      address: '0x5F122465bCf86F45922036970Be6DD7F58820214',
    },
    PIP_GUSD: {
      name: 'PIP_GUSD',
      address: '0xf45Ae69CcA1b9B043dAE2C83A5B65Bc605BEc5F5',
    },
    PIP_UNI: {
      name: 'PIP_UNI',
      address: '0xf363c7e351C96b910b92b45d34190650df4aE8e7',
    },
    PIP_RENBTC: {
      name: 'PIP_RENBTC',
      address: '0xf185d0682d50819263941e5f4EacC763CC5C6C42',
    },
    PIP_AAVE: {
      name: 'PIP_AAVE',
      address: '0x8Df8f06DC2dE0434db40dcBb32a82A104218754c',
    },
    PIP_MATIC: {
      name: 'PIP_MATIC',
      address: '0x8874964279302e6d4e523Fb1789981C39a1034Ba',
    },
    PIP_WSTETH: {
      name: 'PIP_WSTETH',
      address: '0xFe7a2aC0B945f12089aEEB6eCebf4F384D9f043F',
    },
    PIP_ADAI: {
      name: 'PIP_ADAI',
      address: '0x6A858592fC4cBdf432Fc9A1Bc8A0422B99330bdF',
    },
    PIP_UNIV2DAIETH: {
      name: 'PIP_UNIV2DAIETH',
      address: '0xFc8137E1a45BAF0030563EC4F0F851bd36a85b7D',
    },
    PIP_UNIV2WBTCETH: {
      name: 'PIP_UNIV2WBTCETH',
      address: '0x8400D2EDb8B97f780356Ef602b1BdBc082c2aD07',
    },
    PIP_UNIV2USDCETH: {
      name: 'PIP_UNIV2USDCETH',
      address: '0xf751f24DD9cfAd885984D1bA68860F558D21E52A',
    },
    PIP_UNIV2DAIUSDC: {
      name: 'PIP_UNIV2DAIUSDC',
      address: '0x25D03C2C928ADE19ff9f4FFECc07d991d0df054B',
    },
    PIP_UNIV2ETHUSDT: {
      name: 'PIP_UNIV2ETHUSDT',
      address: '0x5f6dD5B421B8d92c59dC6D907C9271b1DBFE3016',
    },
    PIP_UNIV2LINKETH: {
      name: 'PIP_UNIV2LINKETH',
      address: '0xd7d31e62AE5bfC3bfaa24Eda33e8c32D31a1746F',
    },
    PIP_UNIV2UNIETH: {
      name: 'PIP_UNIV2UNIETH',
      address: '0x8462A88f50122782Cc96108F476deDB12248f931',
    },
    PIP_UNIV2WBTCDAI: {
      name: 'PIP_UNIV2WBTCDAI',
      address: '0x5bB72127a196392cf4aC00Cf57aB278394d24e55',
    },
    PIP_UNIV2AAVEETH: {
      name: 'PIP_UNIV2AAVEETH',
      address: '0x32d8416e8538Ac36272c44b0cd962cD7E0198489',
    },
    PIP_UNIV2DAIUSDT: {
      name: 'PIP_UNIV2DAIUSDT',
      address: '0x9A1CD705dc7ac64B50777BcEcA3529E58B1292F1',
    },
    PIP_GUNIV3DAIUSDC1: {
      name: 'PIP_GUNIV3DAIUSDC1',
      address: '0x7F6d78CC0040c87943a0e0c140De3F77a273bd58',
    },
    PIP_GUNIV3DAIUSDC2: {
      name: 'PIP_GUNIV3DAIUSDC2',
      address: '0xcCBa43231aC6eceBd1278B90c3a44711a00F4e93',
    },
    PIP_CRVV1ETHSTETH: {
      name: 'PIP_CRVV1ETHSTETH',
      address: '0xEa508F82728927454bd3ce853171b0e2705880D4',
    },
    PIP_RWA001: {
      name: 'PIP_RWA001',
      address: '0x76A9f30B45F4ebFD60Ce8a1c6e963b1605f7cB6d',
    },
    PIP_RWA002: {
      name: 'PIP_RWA002',
      address: '0xd2473237E20Bd52F8E7cE0FD79403A6a82fbAEC8',
    },
    PIP_RWA003: {
      name: 'PIP_RWA003',
      address: '0xDeF7E88447F7D129420FC881B2a854ABB52B73B8',
    },
    PIP_RWA004: {
      name: 'PIP_RWA004',
      address: '0x5eEE1F3d14850332A75324514CcbD2DBC8Bbc566',
    },
    PIP_RWA005: {
      name: 'PIP_RWA005',
      address: '0x8E6039C558738eb136833aB50271ae065c700d2B',
    },
    PIP_RWA006: {
      name: 'PIP_RWA006',
      address: '0xB8AeCF04Fdf22Ef6C0c6b6536896e1F2870C41D3',
    },
    PIP_RETH: {
      name: 'PIP_RETH',
      address: '0xee7f0b350aa119b3d05dc733a4621a81972f7d47',
    },
    PIP_GNO: {
      name: 'PIP_GNO',
      address: '0xd800ca44fFABecd159c7889c3bf64a217361AEc8',
    },
    PIP_WETH: {
      name: 'PIP_WETH',
      address: '0x81FE72B5A8d1A857d176C3E7d5Bd2679A9B85763',
    },
  },
}
