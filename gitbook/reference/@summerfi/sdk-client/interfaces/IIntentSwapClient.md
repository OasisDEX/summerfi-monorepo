# Interface: IIntentSwapClient

Defined in: [src/interfaces/IIntentSwapClient.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IIntentSwapClient.ts#L29)

Interface for the IntentSwap client implementation.

## See

IIntentSwapProvider

## Methods

### cancelOrder()

```ts
cancelOrder(params): Promise<{
  result: string;
}>;
```

Defined in: [src/interfaces/IIntentSwapClient.ts:127](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IIntentSwapClient.ts#L127)

Cancels an existing order by its ID

#### Parameters

##### params

###### account?

[`Account`](https://viem.sh/docs/)

The account to use for signing the cancellation

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID where the order exists

###### orderId

`string`

The ID of the order to cancel

###### publicClient

\{
\}

The public client to use for sending the cancellation transaction

###### walletClient

\{
\}

#### Returns

`Promise`\<\{
  `result`: `string`;
\}\>

The result of the cancellation request

***

### checkOrder()

```ts
checkOrder(params): Promise<
  | {
  order: EnrichedOrder;
}
| null>;
```

Defined in: [src/interfaces/IIntentSwapClient.ts:142](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IIntentSwapClient.ts#L142)

Checks the status of the order by its ID

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID where the order exists

###### orderId

`string`

The ID of the order to check

#### Returns

`Promise`\<
  \| \{
  `order`: `EnrichedOrder`;
\}
  \| `null`\>

The order info if found, otherwise null

***

### getSellOrderQuote()

```ts
getSellOrderQuote(params): Promise<IntentQuoteData>;
```

Defined in: [src/interfaces/IIntentSwapClient.ts:45](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IIntentSwapClient.ts#L45)

Returns a quote data for the swap between two tokens, by providing the exact amount of input tokens to swap

#### Parameters

##### params

###### fromAmount

[`ITokenAmount`](ITokenAmount.md)

The amount of tokens to swap

###### limitPrice?

`string`

The maximum price the user is willing to accept (optional)

###### partiallyFillable?

`boolean`

Whether the order can be partially filled (default: false)

###### receiver?

[`IAddress`](IAddress.md)

The address that will receive the tokens

###### sender

[`IAddress`](IAddress.md)

The address that will send the tokens

###### slippagePercentage?

`number`

The maximum slippage the user is willing to accept (optional) in percentage (e.g. 1 for 1%)

###### toToken

[`ITokenStanalone`](ITokenStanalone.md)

The token to swap to

#### Returns

`Promise`\<[`IntentQuoteData`](../type-aliases/IntentQuoteData.md)\>

The quote data for the swap, including the order data which can be signed and sent to the provider

Note: The quote does not guarantee the execution of the swap at the quoted amounts, as the market conditions may change.
The quote is valid until the `validTo` timestamp included in the returned data.

***

### sendHookOrder()

```ts
sendHookOrder(params): Promise<{
  orderId: string;
  status: "order_sent";
}>;
```

Defined in: [src/interfaces/IIntentSwapClient.ts:102](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IIntentSwapClient.ts#L102)

Approves and sends the order to the swap provider

#### Parameters

##### params

###### account?

[`Account`](https://viem.sh/docs/)

The account to use for signing the order

###### apiKey?

`string`

Optional API key for the swap provider from the client side, which can be used for enhanced rate limits and analytics

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID where the order will be sent

###### fromAmount

[`ITokenAmount`](ITokenAmount.md)

The amount of tokens to swap

###### limitPrice

[`IPrice`](IPrice.md)

###### order

`UnsignedOrder`

The order data for the swap

###### postHooks?

[`CowHook`](../type-aliases/CowHook.md)[]

Post-interaction hooks to execute after the swap

###### preHooks?

[`CowHook`](../type-aliases/CowHook.md)[]

Pre-interaction hooks to execute before the swap

###### publicClient

\{
\}

The public client to use for sending the transaction

###### sender

[`IAddress`](IAddress.md)

The address that will send the tokens

###### slippagePercentage

`number`

The maximum slippage used for the quote

###### toToken

[`ITokenStanalone`](ITokenStanalone.md)

###### walletClient

\{
\}

#### Returns

`Promise`\<\{
  `orderId`: `string`;
  `status`: `"order_sent"`;
\}\>

The result of sending the order, which can be one of:
- 'order_sent': if the order has been successfully sent, along with the order ID

***

### sendOrder()

```ts
sendOrder(params): Promise<
  | {
  status: "wrap_to_native";
  transactionInfo: TransactionInfo;
}
  | {
  status: "allowance_needed";
  transactionInfo: TransactionInfo;
}
  | {
  orderId: string;
  status: "order_sent";
}>;
```

Defined in: [src/interfaces/IIntentSwapClient.ts:72](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IIntentSwapClient.ts#L72)

Sends the order to the swap provider

#### Parameters

##### params

###### account?

[`Account`](https://viem.sh/docs/)

The account to use for signing the order

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID where the order will be sent

###### fromAmount

[`ITokenAmount`](ITokenAmount.md)

The amount of tokens to swap

###### order

`UnsignedOrder`

The order data for the swap

###### publicClient

\{
\}

The public client to use for sending the transaction

###### sender

[`IAddress`](IAddress.md)

The address that will send the tokens

###### walletClient

\{
\}

#### Returns

`Promise`\<
  \| \{
  `status`: `"wrap_to_native"`;
  `transactionInfo`: [`TransactionInfo`](TransactionInfo.md);
\}
  \| \{
  `status`: `"allowance_needed"`;
  `transactionInfo`: [`TransactionInfo`](TransactionInfo.md);
\}
  \| \{
  `orderId`: `string`;
  `status`: `"order_sent"`;
\}\>

The result of sending the order, which can be one of:
- 'wrap_to_native': if the input token is a wrapped native token and needs to be unwrapped before sending the order
- 'allowance_needed': if the input token is an ERC20 token and needs to be approved for spending before sending the order
- 'order_sent': if the order has been successfully sent, along with the order ID

In case of 'wrap_to_native' or 'allowance_needed', the returned transactionInfo should be used to send the required transaction.
After that, the sendOrder method should be called again to send the order.
