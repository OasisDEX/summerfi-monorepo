# Summer Earn Protocol Subgraph

This package provides a typed GraphQL client for interacting with the Summer Earn Protocol subgraph.

## Table of Contents

- [Summer Earn Protocol Subgraph](#summer-earn-protocol-subgraph)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Modifying the Client](#modifying-the-client)
    - [Example: Adding a New Query](#example-adding-a-new-query)
  - [Development](#development)
  - [TODO](#todo)

## Installation

To install the package, run the following command in your project directory:

```bash
pnpm install @summerfi/summer-earn-protocol-subgraph
```

Or if you're using Yarn:

```bash
yarn add @summerfi/summer-earn-protocol-subgraph
```

## Usage

Here's a basic example of how to use the client:
```ts
const config: SubgraphClientConfig = {
    chainId: ChainId.BASE,
    urlBase: 'https://api.thegraph.com/subgraphs/name'
}
const positions = await getUserPositions({userAddress: '0x123'}, config)

```
or

```typescript
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '@summerfi/summer-earn-protocol-subgraph';

const client = new GraphQLClient('YOUR_SUBGRAPH_ENDPOINT');
const sdk = getSdk(client);

async function getUserPositions(userAddress: string) {
  try {
    const result = await sdk.UserPositions({ userAddress });
    console.log(result.positions);
  } catch (error) {
    console.error('Error fetching user positions:', error);
  }
}

getUserPositions('0x1234567890123456789012345678901234567890');
```

## Modifying the Client

To modify the client, follow these steps:

1. Edit the GraphQL queries in the `queries.graphql` file.

2. Run the code generation script:

   ```bash
   pnpm run prebuild
   ```

   This will update the `client.ts` file with the new types and operations.

3. If you've added new queries or mutations, update the `index.ts` file to export them.

4. Rebuild the package:

   ```bash
   pnpm run build
   ```

### Example: Adding a New Query

1. Add the following query to `queries.graphql`:

   ```graphql
   query GetVaultDetails($vaultId: ID!) {
     vault(id: $vaultId) {
       id
       name
       totalValueLockedUSD
     }
   }
   ```

2. Run the code generation script:

   ```bash
   npm run prebuild
   ```

3. Update `index.ts` to export the new query:

   ```typescript
   export { getSdk, GetVaultDetailsQuery, GetVaultDetailsQueryVariables } from './client';
   ```

   and/or add a new function to the index.ts file:

   ```typescript
    export async function getVaultDetails(
     params: GetVaultDetailsParams,
     config: SubgraphClientConfig,
    ): Promise<GetVaultDetailsQuery> {
        const client = getClient(config.chainId, config.urlBase)
        try {
            return await getVaultDetailsInternal(client, params)
        }
        catch (e) {
            console.error('Error fetching vault details', e)
            throw e
        }
    }
    ```


4. Rebuild the package:

   ```bash
   npm run build
   ```

Now you can use the new query in your code:
```ts
const vaultDetails = await getVaultDetails({vaultId: 'vault-123'}, config)
```
or

```typescript
const result = await sdk.GetVaultDetails({ vaultId: 'vault-123' });
console.log(result.vault);
```

## Development

To set up the development environment:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/summer-earn-protocol-subgraph.git
   cd summer-earn-protocol-subgraph
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development build:

   ```bash
   pnpm run dev
   ```

This will start the TypeScript compiler in watch mode, recompiling the code as you make changes.

## TODO

- add pagination if needed, current provider allows quite generous limits

