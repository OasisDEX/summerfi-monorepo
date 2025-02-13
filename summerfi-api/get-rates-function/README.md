# Rates API Service

## Overview
This service provides APY and historical rate data by combining on-chain rates from subgraphs with off-chain reward rates from a PostgreSQL database.

## UX - API Endpoints

### Available Routes (from apy.ts)

#### GET /api/rates/{chainId}
**Parameters**:
- `chainId` (path): Chain ID (e.g., "1" for Ethereum)
- `productId` (query): Protocol product ID

**Response**:
```json
{
  "interestRates": [
    {
      "rate": "0.0456",  // Total rate (native + reward)
      "nativeRate": "0.03",
      "rewardRate": "0.0156",
      "timestamp": "123456789"
    }
  ]
}
```

#### GET /api/historicalRates/{chainId}
**Parameters**:
- `chainId` (path): Chain ID
- `productId` (query): Protocol product ID

**Response**:
```json
{
  "dailyInterestRates": [],
  "hourlyInterestRates": [],
  "weeklyInterestRates": [],
  "latestInterestRate": []
}
```

## DX - Database Service (db-service.ts)

### Key Components
**RatesService** class handles DB connections and rate fetching:

```typescript
class RatesService {
  async init() { /* DB connection setup */ }
  
  async getLatestRates(chainId: string, productId: string): Promise<DBRate[]> {
    // Fetches from rewardRate table
  }

  async getHistoricalRates(): Promise<DBHistoricalRates> {
    // Combines data from:
    // - dailyRewardRate
    // - hourlyRewardRate  
    // - weeklyRewardRate
  }
}
```

### Data Flow
1. **Combining Rates**:
   - Subgraph provides base rates
   - DB provides reward rates
   - Rates are matched by timestamp (10min window)
   ```typescript
   baseRate + rewardRate = finalRate
   ```

2. **Historical Data**:
   - Daily: Last 365 days
   - Hourly: Last 720 hours
   - Weekly: Last 156 weeks

### Database Schema
**Tables**:
- `rewardRate`: Raw reward rates
  ```sql
  (id, rate, timestamp, productId, network)
  ```
- `daily/hourly/weeklyRewardRate`: Aggregated averages
  ```sql
  (id, averageRate, date, productId, network)
  ```

### Environment Variables
```env
EARN_PROTOCOL_DB_CONNECTION_STRING=postgres://user:pass@host/db
SUBGRAPH_BASE=subgraph_url_base
```

## Development Notes
1. **Caching**: Redis is used for response caching
2. **Error Handling**:
   - 400 if missing chainId/productId
   - 500 for internal errors with detailed logging
3. **Observability**:
   - All rate combinations are logged with counts
   - Powertools logger used for structured logging