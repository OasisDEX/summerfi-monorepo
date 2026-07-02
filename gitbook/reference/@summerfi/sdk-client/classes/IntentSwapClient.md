# Class: IntentSwapClient

Defined in: [src/implementation/IntentSwapClient.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/IntentSwapClient.ts#L23)

Interface for the IntentSwap client implementation.

## See

IIntentSwapProvider

## Extends

- `IRPCClient`

## Implements

- [`IIntentSwapClient`](../interfaces/IIntentSwapClient.md)

## Constructors

### Constructor

```ts
new IntentSwapClient(params): IntentSwapClient;
```

Defined in: [src/implementation/IntentSwapClient.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/IntentSwapClient.ts#L30)

#### Parameters

##### params

###### rpcClient

`TRPCClient`

#### Returns

`IntentSwapClient`

#### Overrides

```ts
IRPCClient.constructor
```

## Properties

### cancelOrder()

```ts
cancelOrder: (params) => Promise<{
  result: string;
}>;
```

Defined in: [src/implementation/IntentSwapClient.ts:197](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/IntentSwapClient.ts#L197)

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

#### See

IIntentSwapClient.cancelOrder

#### Implementation of

[`IIntentSwapClient`](../interfaces/IIntentSwapClient.md).[`cancelOrder`](../interfaces/IIntentSwapClient.md#cancelorder)

***

### checkOrder()

```ts
checkOrder: (params) => Promise<
  | {
  order: EnrichedOrder;
}
| null>;
```

Defined in: [src/implementation/IntentSwapClient.ts:225](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/IntentSwapClient.ts#L225)

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

#### See

IIntentSwapClient.checkOrder

#### Implementation of

[`IIntentSwapClient`](../interfaces/IIntentSwapClient.md).[`checkOrder`](../interfaces/IIntentSwapClient.md#checkorder)

***

### getSellOrderQuote()

```ts
getSellOrderQuote: (params) => Promise<IntentQuoteData>;
```

Defined in: [src/implementation/IntentSwapClient.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/IntentSwapClient.ts#L35)

Returns a quote data for the swap between two tokens, by providing the exact amount of input tokens to swap

#### Parameters

##### params

###### fromAmount

[`ITokenAmount`](../interfaces/ITokenAmount.md)

The amount of tokens to swap

###### limitPrice?

`string`

The maximum price the user is willing to accept (optional)

###### partiallyFillable?

`boolean`

Whether the order can be partially filled (default: false)

###### receiver?

[`IAddress`](../interfaces/IAddress.md)

The address that will receive the tokens

###### sender

[`IAddress`](../interfaces/IAddress.md)

The address that will send the tokens

###### slippagePercentage?

`number`

The maximum slippage the user is willing to accept (optional) in percentage (e.g. 1 for 1%)

###### toToken

[`ITokenStanalone`](../interfaces/ITokenStanalone.md)

The token to swap to

#### Returns

`Promise`\<[`IntentQuoteData`](../type-aliases/IntentQuoteData.md)\>

The quote data for the swap, including the order data which can be signed and sent to the provider

Note: The quote does not guarantee the execution of the swap at the quoted amounts, as the market conditions may change.
The quote is valid until the `validTo` timestamp included in the returned data.

#### See

IIntentSwapClient.getSellOrderQuote

#### Implementation of

[`IIntentSwapClient`](../interfaces/IIntentSwapClient.md).[`getSellOrderQuote`](../interfaces/IIntentSwapClient.md#getsellorderquote)

***

### sendHookOrder()

```ts
sendHookOrder: (params) => Promise<{
  orderId: string;
  status: "order_sent";
}>;
```

Defined in: [src/implementation/IntentSwapClient.ts:88](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/IntentSwapClient.ts#L88)

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

[`ITokenAmount`](../interfaces/ITokenAmount.md)

The amount of tokens to swap

###### limitPrice

[`IPrice`](../interfaces/IPrice.md)

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

[`IAddress`](../interfaces/IAddress.md)

The address that will send the tokens

###### slippagePercentage

`number`

The maximum slippage used for the quote

###### toToken

[`ITokenStanalone`](../interfaces/ITokenStanalone.md)

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

#### Implementation of

[`IIntentSwapClient`](../interfaces/IIntentSwapClient.md).[`sendHookOrder`](../interfaces/IIntentSwapClient.md#sendhookorder)

***

### sendOrder()

```ts
sendOrder: (params) => Promise<
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

Defined in: [src/implementation/IntentSwapClient.ts:57](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/IntentSwapClient.ts#L57)

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

[`ITokenAmount`](../interfaces/ITokenAmount.md)

The amount of tokens to swap

###### order

`UnsignedOrder`

The order data for the swap

###### publicClient

\{
\}

The public client to use for sending the transaction

###### sender

[`IAddress`](../interfaces/IAddress.md)

The address that will send the tokens

###### walletClient

\{
\}

#### Returns

`Promise`\<
  \| \{
  `status`: `"wrap_to_native"`;
  `transactionInfo`: [`TransactionInfo`](../interfaces/TransactionInfo.md);
\}
  \| \{
  `status`: `"allowance_needed"`;
  `transactionInfo`: [`TransactionInfo`](../interfaces/TransactionInfo.md);
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

#### See

IIntentSwapClient.sendOrder

#### Implementation of

[`IIntentSwapClient`](../interfaces/IIntentSwapClient.md).[`sendOrder`](../interfaces/IIntentSwapClient.md#sendorder)

## Accessors

### rpcClient

#### Get Signature

```ts
get protected rpcClient(): TRPCClient;
```

Defined in: [src/interfaces/IRPCClient.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IRPCClient.ts#L10)

##### Returns

`TRPCClient`

#### Inherited from

```ts
IRPCClient.rpcClient
```
