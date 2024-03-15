import { Address, ChainInfo, Percentage, Token, TokenAmount, borrowFromPosition, depositToPosition, newEmptyPositionFromPool } from '@summerfi/sdk-common/common';
import { LendingPool, ProtocolName } from '@summerfi/sdk-common/protocols';

const testChain = ChainInfo.createFrom({ chainId: 1, name: 'test' });

const testCollateral = Token.createFrom({
    chainInfo: testChain,
    address: Address.createFrom({ value: '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' }),
    decimals: 18,
    name: "Collateral",
    symbol: "COL",
});

const testDebt = Token.createFrom({
    chainInfo: testChain,
    address: Address.createFrom({ value: '0x814FaE9f487206471B6B0D713cD51a2D35980000' }),
    decimals: 18,
    name: "Debt",
    symbol: "DBT",
});

export const otherTestCollateral = Token.createFrom({
    chainInfo: testChain,
    address: Address.createFrom({ value: '0x15222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' }),
    decimals: 5,
    name: "Collateral2",
    symbol: "COL",
});

export const otherTestDebt = Token.createFrom({
    chainInfo: testChain,
    address: Address.createFrom({ value: '0x114FaE9f487206471B6B0D713cD51a2D35980000' }),
    decimals: 3,
    name: "Debt2",
    symbol: "DBT2",
});

const testSourceLendingPool = new LendingPool({
    collateralTokens: [testCollateral],
    debtTokens: [testDebt],
    maxLTV: Percentage.createFrom({ percentage: 80 }),
    poolId: {
        protocol: ProtocolName.Maker,
    },
    protocol: {
        chainInfo: testChain,
        name: ProtocolName.Maker,
    },
});

export const testSourcePosition = borrowFromPosition(
    depositToPosition(
        newEmptyPositionFromPool(testSourceLendingPool), TokenAmount.createFrom({ token: testCollateral, amount: '100' })
    ),
    TokenAmount.createFrom({ token: testDebt, amount: '50' })
);

export const testTargetLendingPool = new LendingPool({
    collateralTokens: [testCollateral],
    debtTokens: [testDebt],
    maxLTV: Percentage.createFrom({ percentage: 80 }),
    poolId: {
        protocol: ProtocolName.Spark,
    },
    protocol: {
        chainInfo: testChain,
        name: ProtocolName.Spark,
    },
});

export const testTargetLendingPoolRequiredSwaps = new LendingPool({
    collateralTokens: [otherTestCollateral],
    debtTokens: [otherTestDebt],
    maxLTV: Percentage.createFrom({ percentage: 90 }),
    poolId: {
        protocol: ProtocolName.Spark,
    },
    protocol: {
        chainInfo: testChain,
        name: ProtocolName.Spark,
    },
});

