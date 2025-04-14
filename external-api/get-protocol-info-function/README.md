# Protocol Info API Endpoints

## Get All Users
Retrieves all user addresses that have interacted with the protocol across all supported chains.

**Endpoint:** `/all-users`  
**Method:** GET

**Response:**
```json
{
  "addresses": string[]  // Array of Ethereum addresses
}
```

## Get Users Details
Retrieves detailed information about specific users including their positions, TVL, and rewards.

**Endpoint:** `/users`  
**Method:** POST (preferred) or GET (deprecated)

**Request Body (POST):**
```json
{
  "addresses": string[],  // Array of Ethereum addresses
  "chainId": number      // Optional: Specific chain ID to query
}
```

**Query Parameters (GET - deprecated):**
- `addresses`: Comma-separated list of Ethereum addresses
- `chainId`: (Optional) Specific chain ID to query

**Response:**
```json
{
  "users": [
    {
      "address": string,
      "totalValueLockedUSD": number,
      "rewards": {
        "unclaimed": number,
        "claimed": number,
        "total": number
      }
    }
  ]
}
```

## Get Protocol Stats
Retrieves overall protocol statistics.

**Endpoint:** `/`  
**Method:** GET

**Query Parameters:**
- `chainId`: (Optional) Specific chain ID to query

**Response:**
```json
{
  "protocol": {
    "totalValueLockedUSD": number,
    "totalVaults": number
  }
}
```

## Notes
- All monetary values are normalized and represented in USD
- Rewards values are normalized (divided by 10^18)
- The API supports multiple chains. If no chainId is specified, it will query all supported chains
- Maximum page size for queries is 1000 items