# Beach Club Rewards System

## 🚀 Multi-Currency Rewards Platform

A comprehensive rewards tracking and calculation system that processes data from multiple blockchain networks and rewards referral codes based on their users' activity. The system supports multiple reward currencies including points, SUMR tokens, and trading fee rewards in various assets.

## Features

### Enhanced Multi-Currency Rewards System

The system now supports **multiple reward currencies** with precise asset tracking:

- **Points Rewards**: Traditional referral points based on deposit amounts and user activity
- **SUMR Token Rewards**: Tiered SUMR token rewards based on deposit volumes
- **Fee Rewards**: Trading fee sharing in underlying assets (USDC, WETH, etc.)
- **Asset-Native Tracking**: Rewards tracked in both asset amounts and USD equivalents
- **Batch Processing**: Precise distribution tracking with unique batch IDs

### Rewards Calculation Formulas

#### Points Formula
```
points_per_hour = total_deposits_usd * (base_rate + log_multiplier * ln(active_users + 1)) / 24
```

#### SUMR Token Rewards (Tiered)
```
Tier 1 (≤$10K):    0.1% annual / SUMR price / 8760 hours
Tier 2 (≤$100K):   0.2% annual / SUMR price / 8760 hours  
Tier 3 (≤$250K):   0.3% annual / SUMR price / 8760 hours
Tier 4 (≤$500K):   0.4% annual / SUMR price / 8760 hours
Tier 5 (>$500K):   0.5% annual / SUMR price / 8760 hours
```

#### Fee Rewards
- **Referrer Fees**: Hourly fees earned from referred users' positions
- **Owner Fees**: Hourly fees earned from referral code owner's positions
- **Multi-Asset**: Supports USDC, WETH, and other trading fee currencies

### Default Configuration
- `points_formula_base`: 0.00005 (configurable)
- `points_formula_log_multiplier`: 0.0005 (configurable)  
- `active_user_threshold_usd`: $0.1 USD (configurable)
- `processing_interval`: 1 hour (configurable)
- `sumr_token_price_usd`: $0.25 (configurable)

### Key Features

- **Multi-Chain Support**: Ethereum, Sonic, Arbitrum, Base
- **Hourly Processing**: Automated rewards calculation every hour using position snapshots
- **Active User Concept**: Users with deposits ≥ threshold (configurable)
- **Historical Backfill**: Process historical data using time-specific snapshots
- **Batch Distribution Tracking**: Precise tracking with unique batch IDs
- **Configuration Management**: Runtime configuration updates
- **Type-safe Database**: Kysely integration for compile-time query validation
- **Asset-Native Rewards**: Track rewards in actual tokens alongside USD values

## GraphQL Integration

The system fetches position data using GraphQL snapshots:

```graphql
{
  accounts {
    positions {
      vault {
        inputToken {
          symbol
        }
      }
      snapshots(where: {timestamp_gt: $timestampGt, timestamp_lt: $timestampLt}) {
        inputTokenBalanceNormalized
        inputTokenBalanceNormalizedInUSD
        timestamp
      }
    }
  }
}
```

This enables:
- Asset-specific balance tracking (USDC amounts, WETH amounts, etc.)
- USD equivalent calculations
- Historical accuracy for backfill operations
- Time-specific reward distributions

## Database Schema

### Enhanced Rewards Architecture

The system uses a comprehensive normalized schema supporting multiple currencies and precise tracking:

#### 🏢 **Referral Codes Table**
Central referral code management:
- `id` - Unique referral code identifier
- `custom_code` - Human-readable code (optional)
- `type` - Code type (user, integrator, test)
- `active_users_count` - Number of active referred users
- `total_deposits_referred_usd` - Total USD value of referred deposits

#### 👥 **Users Table**
User management with referral relationships:
- `id` - User's wallet address (primary key)
- `referrer_id` - Referral code that referred this user
- `referral_code` - User's own referral code (auto-generated)
- `referral_chain` - Blockchain where referral occurred
- `is_active` - Whether user meets activity threshold

#### 💰 **Rewards Balances Table**
**Normalized rewards tracking per referral code per currency:**
- `referral_code_id` - Referral code earning rewards
- `currency` - Reward currency (points, SUMR, USDC, WETH, etc.)
- `balance` - Current balance in asset terms
- `balance_usd` - USD equivalent (null for points/SUMR)
- `amount_per_day` - Daily earning rate in asset terms
- `amount_per_day_usd` - Daily earning rate in USD
- `total_earned` - Lifetime earnings in asset terms
- `total_claimed` - Amount claimed/withdrawn

#### 📊 **Rewards Distributions Table**
**Detailed distribution history with batch tracking:**
- `batch_id` - Unique batch identifier for each processing run
- `referral_code_id` - Referral code receiving distribution
- `currency` - Reward currency
- `amount` - Amount distributed (hourly, in asset terms)
- `description` - Distribution type (regular, bonus, etc.)
- `distribution_timestamp` - When distribution occurred

#### 🏦 **Positions Table**
**Enhanced position tracking with asset details:**
- `id, chain` - Position identifier (composite primary key)
- `user_id` - Position owner
- `current_deposit_usd` - USD value of deposits
- `current_deposit_asset` - Asset amount of deposits
- `currency_symbol` - Asset symbol (USDC, WETH, etc.)
- `fees_per_day_referrer` - Daily referrer fees in asset terms
- `fees_per_day_owner` - Daily owner fees in asset terms
- `fees_per_day_referrer_usd` - Daily referrer fees in USD
- `fees_per_day_owner_usd` - Daily owner fees in USD

#### ⚙️ **Configuration Tables**
- **Points Config**: Runtime configuration management
- **Processing Checkpoint**: Last processed timestamp tracking
- **Daily Stats**: Historical statistics per referral code

### Key Schema Benefits

1. **Multi-Currency Support**: Native support for points, tokens, and fee currencies
2. **Asset-Native Tracking**: Balances in actual tokens (1.5 USDC) alongside USD values
3. **Precise Distribution Tracking**: Batch IDs eliminate timing-based inconsistencies
4. **Referral Code Focus**: Rewards tied to referral codes, supporting codes without users
5. **Comprehensive Audit Trail**: Complete history of all distributions
6. **Normalized Design**: Eliminates data duplication and ensures consistency

## Usage

### Processing Commands

```bash
# Process latest period
pnpm run execute

# Reset database and reprocess
pnpm run resrun

# Run tests
pnpm test
```

### Configuration Management

```bash
# Update processing interval
pnpm run config processing_interval_hours 1

# Update active user threshold  
pnpm run config active_user_threshold_usd 0.1

# Update points formula
pnpm run config points_formula_base 0.00005
pnpm run config points_formula_log_multiplier 0.0005
```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Subgraph      │    │   GraphQL        │    │   Rewards       │
│   (Position     │◄───┤   Client         │◄───┤   Processor     │
│   Snapshots)    │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
┌─────────────────┐    ┌──────────────────┐             │
│   Configuration │◄───┤   Database       │◄────────────┘
│   Service       │    │   (Normalized    │
│                 │    │   Multi-Currency)│
└─────────────────┘    └──────────────────┘
                                │
                       ┌──────────────────┐
                       │   Batch-Based    │
                       │   Distribution   │
                       │   Tracking       │
                       └──────────────────┘
```

## Reward Types

### 1. Points Rewards
- **Purpose**: Gamification and engagement
- **Calculation**: Logarithmic formula based on deposits and referrals
- **Currency**: Non-transferable points
- **Distribution**: Hourly

### 2. SUMR Token Rewards  
- **Purpose**: Protocol token incentives
- **Calculation**: Tiered percentage of deposits
- **Currency**: SUMR tokens
- **Distribution**: Hourly
- **Tiers**: 5 tiers from 0.1% to 0.5% annual

### 3. Fee Rewards
- **Purpose**: Revenue sharing from trading fees
- **Calculation**: Actual fees generated by positions
- **Currencies**: USDC, WETH, and other trading pairs
- **Distribution**: Hourly
- **Types**: Referrer fees + Position owner fees

## Environment Variables

```bash
# Database Configuration
BEACH_CLUB_REWARDS_DB_CONNECTION_STRING=postgresql://user:pass@host:port/db

# Optional: Custom subgraph URLs
ETHEREUM_SUBGRAPH_URL=https://subgraph.staging.oasisapp.dev/summer-protocol
SONIC_SUBGRAPH_URL=https://subgraph.staging.oasisapp.dev/summer-protocol-sonic
ARBITRUM_SUBGRAPH_URL=https://subgraph.staging.oasisapp.dev/summer-protocol-arbitrum
BASE_SUBGRAPH_URL=https://subgraph.staging.oasisapp.dev/summer-protocol-base
HYPERLIQUID_SUBGRAPH_URL=https://subgraph.staging.oasisapp.dev/summer-protocol-hyperliquid
```

## Example Queries

### Get All Rewards for a Referral Code
```sql
SELECT currency, balance, balance_usd, amount_per_day 
FROM rewards_balances 
WHERE referral_code_id = '12345';
```

### Track Distribution History
```sql
SELECT batch_id, currency, amount, distribution_timestamp
FROM rewards_distributions 
WHERE referral_code_id = '12345' 
ORDER BY distribution_timestamp DESC;
```

### Asset-Specific Balances
```sql
SELECT currency, balance, amount_per_day
FROM rewards_balances 
WHERE referral_code_id = '12345' AND currency IN ('USDC', 'WETH');
```

### Daily Stats
```sql
SELECT date, points_earned, active_users, total_deposits
FROM daily_stats 
WHERE referral_id = '12345' 
ORDER BY date DESC LIMIT 30;
```

## Troubleshooting

### Common Issues

1. **Balance Inconsistencies**: Check batch_id uniqueness and distribution completeness
2. **Missing Asset Data**: Verify position snapshots include inputTokenBalanceNormalized
3. **Currency Mismatches**: Ensure position currency_symbol matches reward currencies
4. **Batch Processing Errors**: Check for duplicate batch_ids or timing issues

### Debug Commands

```bash
# Check rewards balances
SELECT * FROM rewards_balances WHERE referral_code_id = 'YOUR_CODE';

# Verify distributions
SELECT batch_id, COUNT(*) FROM rewards_distributions GROUP BY batch_id ORDER BY batch_id DESC LIMIT 10;

# Check position data
SELECT currency_symbol, COUNT(*) FROM positions GROUP BY currency_symbol;
```

## Development

### Building
```bash
pnpm build
```

### Testing
```bash
pnpm test
pnpm run test:watch
```

### Database Migration
```bash
pnpm run migrate
pnpm run migrate:rollback
```

## Contributing

1. Use TypeScript for type safety
2. Add tests for new reward types
3. Update documentation for schema changes
4. Follow batch-based processing patterns
5. Test with multiple currencies

---

**Note**: This system supports referral codes that may exist without associated users (integrator codes, test codes), making it more flexible than user-based reward systems. Rewards are always tied to referral codes, and users automatically receive their own referral codes upon creation. 