import { ITokenService } from '../interfaces/ProtocolPlugin';
import { Address, ChainInfo, Token, TokenSymbol } from '@summerfi/sdk-common/common';

// TODO: Implement the TokenService to handle different chains
export class TokenService implements ITokenService {
  private tokens: Record<string, Token> = {
    'DAI': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    }),
    'WETH': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
    }),
    'SDAI': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({ value: '0x83F20F44975D03b1b09e64809B757c47f942BEeA' }),
      symbol: 'SDAI',
      name: 'Savings DAI',
      decimals: 18,
    }),
    'USDC': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({ value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }),
      symbol: 'USDC',
      name: 'Circle USD Stablecoin',
      decimals: 6,
    }),
    'WSTETH': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({ value: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0' }),
      symbol: 'WSTETH',
      name: 'Wrapped staked ETH',
      decimals: 18,
    }),
    'WBTC': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({ value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' }),
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      decimals: 8,
    }),
    'GNO': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({ value: '0x6810e776880C02933D47DB1b9fc05908e5386b96' }),
      symbol: 'GNO',
      name: 'Gnosis Token',
      decimals: 18,
    }),
    'RETH': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({ value: '0xae78736Cd615f374D3085123A210448E74Fc6393' }),
      symbol: 'RETH',
      name: 'Rocket ETH',
      decimals: 18,
    }),
    'USDT': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({ value: '0xdAC17F958D2ee523a2206206994597C13D831ec7' }),
      symbol: 'USDT',
      name: 'Tether USD Stablecoin',
      decimals: 6,
    }),
  };

  async getTokenByAddress(address: Address): Promise<Token> {
    const token = Object.values(this.tokens).find(token => token.address.equals(address));
    if (!token) {
      throw new Error(`Token not found for ${address}`);
    }
    return token;
  }
  async getTokenBySymbol(symbol: TokenSymbol): Promise<Token> {
    return this.tokens[symbol];
  }
}
