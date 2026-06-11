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

Defined in: [src/user/interfaces/IUser.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/user/interfaces/IUser.ts#L26)

Zod schema for the data part of IUser
