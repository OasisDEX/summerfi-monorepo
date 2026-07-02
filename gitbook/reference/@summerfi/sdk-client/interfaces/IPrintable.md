# Interface: IPrintable

Defined in: [../sdk-common/src/common/interfaces/IPrintable.ts:6](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPrintable.ts#L6)

Interface for printable objects.

This enables more readable debug objects

## Extended by

- [`ITokenStanalone`](ITokenStanalone.md)
- [`IAddress`](IAddress.md)
- [`IChainInfo`](IChainInfo.md)
- [`IFiatCurrencyAmount`](IFiatCurrencyAmount.md)
- [`IPercentage`](IPercentage.md)
- [`IPool`](IPool.md)
- [`IPrice`](IPrice.md)
- [`IRiskRatio`](IRiskRatio.md)
- [`ISDKError`](ISDKError.md)
- [`ITokenAmount`](ITokenAmount.md)
- [`IExternalLendingPosition`](IExternalLendingPosition.md)
- [`IExternalLendingPositionId`](IExternalLendingPositionId.md)
- [`IUser`](IUser.md)

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/common/interfaces/IPrintable.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPrintable.ts#L14)

Returns a string representation of the object

#### Returns

`string`

string

The string representation should have enough info to debug the object
