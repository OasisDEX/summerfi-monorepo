# Type Alias: EarnAppCookieVerifier()

```ts
type EarnAppCookieVerifier = (userAddress) => Promise<void>;
```

Defined in: [../sdk-common/src/common/types/EarnAppCookieVerifier.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/EarnAppCookieVerifier.ts#L8)

## Parameters

### userAddress

[`AddressValue`](AddressValue.md)

## Returns

`Promise`\<`void`\>

## Name

EarnAppCookieVerifier

## Description

Callback that verifies a request is authorized for the given user address.
Should throw an error if the verification fails.
