-- CreateEnum
CREATE TYPE "vault_type" AS ENUM ('borrow', 'multiply', 'earn');

-- CreateEnum
CREATE TYPE "protocol" AS ENUM ('maker', 'aavev2', 'aavev3', 'ajna', 'sparkv3', 'morphoblue');

-- CreateEnum
CREATE TYPE "network" AS ENUM ('ethereum', 'arbitrum', 'polygon', 'optimism', 'base');

-- CreateEnum
CREATE TYPE "networkWithTestnets" AS ENUM ('ethereum', 'ethereum_goerli', 'arbitrum', 'arbitrum_goerli', 'polygon', 'polygon_mumbai', 'optimism', 'optimism_goerli', 'base', 'base_goerli');

-- CreateEnum
CREATE TYPE "product" AS ENUM ('borrow', 'multiply', 'earn');

-- CreateEnum
CREATE TYPE "managementType" AS ENUM ('active', 'active_with_liq_risk', 'passive');

-- CreateEnum
CREATE TYPE "managementTypeSimple" AS ENUM ('active', 'passive');

-- CreateEnum
CREATE TYPE "earnStrategies" AS ENUM ('liquidity_provision', 'yield_loop', 'other', 'erc_4626');

-- CreateEnum
CREATE TYPE "multiplyStrategyType" AS ENUM ('long', 'short');

-- CreateEnum
CREATE TYPE "automationFeature" AS ENUM ('stopLoss', 'trailingStopLoss', 'autoBuy', 'autoSell', 'autoTakeProfit', 'partialTakeProfit', 'constantMultiple');

-- CreateEnum
CREATE TYPE "ajna_rewards_source" AS ENUM ('core', 'bonus');

-- CreateEnum
CREATE TYPE "ajna_rewards_position_type" AS ENUM ('earn', 'borrow');

-- CreateTable
CREATE TABLE "migrations" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "hash" VARCHAR(40) NOT NULL,
    "executed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tos_approval" (
    "id" SERIAL NOT NULL,
    "address" VARCHAR(66) NOT NULL,
    "doc_version" VARCHAR NOT NULL,
    "sign_date" TIMESTAMP(6) NOT NULL,
    "signature" VARCHAR NOT NULL DEFAULT '0x0',
    "message" VARCHAR NOT NULL DEFAULT '0x0',
    "chain_id" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tos_approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vault" (
    "vault_id" INTEGER NOT NULL,
    "type" "vault_type" NOT NULL,
    "owner_address" CHAR(42) NOT NULL,
    "chain_id" INTEGER,
    "protocol" VARCHAR(32) NOT NULL DEFAULT 'maker',
    "token_pair" VARCHAR(32) NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "user" (
    "address" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_that_referred_address" TEXT,
    "accepted" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "weekly_claim" (
    "id" SERIAL NOT NULL,
    "week_number" INTEGER NOT NULL,
    "user_address" TEXT NOT NULL,
    "proof" TEXT[],
    "amount" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weekly_claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merkle_tree" (
    "week_number" INTEGER NOT NULL,
    "tree_root" TEXT NOT NULL,
    "start_block" DECIMAL(78,0),
    "end_block" DECIMAL(78,0),
    "timestamp" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "snapshot" TEXT,
    "tx_processed" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "wallet_risk" (
    "address" VARCHAR(66) NOT NULL,
    "last_check" TIMESTAMP(6) NOT NULL,
    "is_risky" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "collateral_type" (
    "collateral_name" TEXT NOT NULL,
    "next_price" DECIMAL(65,30) NOT NULL,
    "current_price" DECIMAL(65,30) NOT NULL,
    "liquidation_ratio" DECIMAL(65,30) NOT NULL,
    "liquidation_penalty" DECIMAL(65,30) DEFAULT 1.13,
    "rate" DECIMAL(65,30),
    "market_price" DECIMAL(65,30),

    CONSTRAINT "collateral_name_key" PRIMARY KEY ("collateral_name")
);

-- CreateTable
CREATE TABLE "discover" (
    "protocol_id" TEXT NOT NULL,
    "position_id" TEXT NOT NULL,
    "collateral_type" TEXT NOT NULL,
    "vault_normalized_debt" DECIMAL(65,30),
    "vault_debt" DECIMAL(65,30) NOT NULL,
    "vault_collateral" DECIMAL(65,30) NOT NULL,
    "yield_30d" DECIMAL(65,30) NOT NULL,
    "status" JSONB NOT NULL,
    "last_action" JSONB NOT NULL,
    "pnl_all" DECIMAL(65,30) NOT NULL,
    "pnl_1d" DECIMAL(65,30) NOT NULL,
    "pnl_7d" DECIMAL(65,30) NOT NULL,
    "pnl_30d" DECIMAL(65,30) NOT NULL,
    "pnl_365d" DECIMAL(65,30) NOT NULL,
    "pnl_ytd" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT,
    "vault_type" TEXT,
    "net_profit_all" DECIMAL(65,30),
    "net_profit_1d" DECIMAL(65,30),
    "net_profit_7d" DECIMAL(65,30),
    "net_profit_30d" DECIMAL(65,30),
    "net_profit_365d" DECIMAL(65,30),
    "net_profit_ytd" DECIMAL(65,30)
);

-- CreateTable
CREATE TABLE "users_who_follow_vaults" (
    "user_address" TEXT NOT NULL,
    "vault_id" INTEGER NOT NULL,
    "vault_chain_id" INTEGER NOT NULL,
    "protocol" "protocol" NOT NULL,

    CONSTRAINT "users_who_follow_vaults_pkey" PRIMARY KEY ("user_address","vault_id","vault_chain_id","protocol")
);

-- CreateTable
CREATE TABLE "product_hub_items" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "network" "networkWithTestnets" NOT NULL,
    "primaryToken" TEXT NOT NULL,
    "primaryTokenGroup" TEXT,
    "product" "product"[],
    "protocol" "protocol" NOT NULL,
    "secondaryToken" TEXT NOT NULL,
    "secondaryTokenGroup" TEXT,
    "weeklyNetApy" TEXT,
    "depositToken" TEXT,
    "fee" TEXT,
    "liquidity" TEXT,
    "managementType" "managementTypeSimple",
    "maxLtv" TEXT,
    "maxMultiply" TEXT,
    "multiplyStrategy" TEXT,
    "multiplyStrategyType" "multiplyStrategyType",
    "reverseTokens" BOOLEAN,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tooltips" JSONB,
    "primaryTokenAddress" TEXT NOT NULL DEFAULT '0x0000000000000000000000000000000000000000',
    "secondaryTokenAddress" TEXT NOT NULL DEFAULT '0x0000000000000000000000000000000000000000',
    "hasRewards" BOOLEAN NOT NULL DEFAULT false,
    "earnStrategyDescription" TEXT,
    "earnStrategy" "earnStrategies",
    "automationFeatures" "automationFeature"[],

    CONSTRAINT "product_hub_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ajna_rewards_weekly_claim" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chain_id" INTEGER NOT NULL,
    "user_address" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "week_number" INTEGER NOT NULL,
    "proof" TEXT[],
    "source" "ajna_rewards_source" NOT NULL,

    CONSTRAINT "ajna_rewards_weekly_claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ajna_rewards_daily_claim" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chain_id" INTEGER NOT NULL,
    "user_address" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "week_number" INTEGER NOT NULL,
    "day_number" INTEGER NOT NULL,
    "account_address" TEXT NOT NULL,
    "pool_address" TEXT NOT NULL,
    "source" "ajna_rewards_source" NOT NULL,
    "type" "ajna_rewards_position_type" NOT NULL,

    CONSTRAINT "ajna_rewards_daily_claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ajna_rewards_merkle_tree" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chain_id" INTEGER NOT NULL,
    "week_number" INTEGER NOT NULL,
    "tree_root" TEXT NOT NULL,
    "tx_processed" BOOLEAN NOT NULL DEFAULT false,
    "source" "ajna_rewards_source" NOT NULL,

    CONSTRAINT "ajna_rewards_merkle_tree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "precision" INTEGER NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "source" VARCHAR
);

-- CreateTable
CREATE TABLE "vault_change_log" (
    "id" SERIAL NOT NULL,
    "vault_id" INTEGER NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "token_pair" VARCHAR(32) NOT NULL,
    "owner_address" CHAR(42) NOT NULL,
    "protocol" VARCHAR(32) NOT NULL,
    "old_vault_type" "vault_type",
    "new_vault_type" "vault_type",
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vault_change_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "migrations_name_key" ON "migrations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tos_approval_unique_signature" ON "tos_approval"("address", "doc_version");

-- CreateIndex
CREATE UNIQUE INDEX "tos_approval_address_chain_id_doc_version_key" ON "tos_approval"("address", "chain_id", "doc_version");

-- CreateIndex
CREATE UNIQUE INDEX "vault_unique_constraint" ON "vault"("vault_id", "chain_id", "protocol", "token_pair", "owner_address");

-- CreateIndex
CREATE UNIQUE INDEX "user_address_key" ON "user"("address");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_claim_week_number_user_address_key" ON "weekly_claim"("week_number", "user_address");

-- CreateIndex
CREATE UNIQUE INDEX "merkle_tree_week_number_key" ON "merkle_tree"("week_number");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_risk_unique_index" ON "wallet_risk"("address");

-- CreateIndex
CREATE UNIQUE INDEX "discover_protocol_id_position_id_key" ON "discover"("protocol_id", "position_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_hub_items_label_network_product_protocol_primaryTok_key" ON "product_hub_items"("label", "network", "product", "protocol", "primaryToken", "secondaryToken");

-- CreateIndex
CREATE UNIQUE INDEX "ajna_rewards_weekly_claim_week_number_user_address_chain_id_key" ON "ajna_rewards_weekly_claim"("week_number", "user_address", "chain_id", "source");

-- CreateIndex
CREATE UNIQUE INDEX "ajna_rewards_daily_claim_day_number_pool_address_account_ad_key" ON "ajna_rewards_daily_claim"("day_number", "pool_address", "account_address", "chain_id", "source", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ajna_rewards_merkle_tree_week_number_chain_id_source_key" ON "ajna_rewards_merkle_tree"("week_number", "chain_id", "source");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_address_chain_id_key" ON "tokens"("address", "chain_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_user_that_referred_address_fkey" FOREIGN KEY ("user_that_referred_address") REFERENCES "user"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_claim" ADD CONSTRAINT "weekly_claim_user_address_fkey" FOREIGN KEY ("user_address") REFERENCES "user"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

