# Variable: UserDataSchema

```ts
const UserDataSchema: ZodObject<{
  chainInfo: ZodType<IChainInfo, ZodTypeDef, IChainInfo>;
  wallet: ZodType<IWallet, ZodTypeDef, IWallet>;
}, "strip", ZodTypeAny, {
  chainInfo: IChainInfo;
  wallet: IWallet;
}, {
  chainInfo: IChainInfo;
  wallet: IWallet;
}>;
```

Defined in: [sdk/sdk-common/src/user/interfaces/IUser.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/user/interfaces/IUser.ts#L26)

Zod schema for the data part of IUser
