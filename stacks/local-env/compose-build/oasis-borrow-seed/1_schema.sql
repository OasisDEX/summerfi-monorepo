ALTER SCHEMA public OWNER TO pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';


CREATE TYPE public.ajna_rewards_position_type AS ENUM (
    'earn',
    'borrow'
);


ALTER TYPE public.ajna_rewards_position_type OWNER TO "user";

CREATE TYPE public.ajna_rewards_source AS ENUM (
    'core',
    'bonus'
);


ALTER TYPE public.ajna_rewards_source OWNER TO "user";

CREATE TYPE public."automationFeature" AS ENUM (
    'stopLoss',
    'trailingStopLoss',
    'autoBuy',
    'autoSell',
    'autoTakeProfit',
    'partialTakeProfit',
    'constantMultiple'
);


ALTER TYPE public."automationFeature" OWNER TO "user";

CREATE TYPE public."earnStrategies" AS ENUM (
    'liquidity_provision',
    'yield_loop',
    'other',
    'erc_4626'
);


ALTER TYPE public."earnStrategies" OWNER TO "user";

CREATE TYPE public."managementType" AS ENUM (
    'active',
    'active_with_liq_risk',
    'passive'
);


ALTER TYPE public."managementType" OWNER TO "user";

CREATE TYPE public."managementTypeSimple" AS ENUM (
    'active',
    'passive'
);


ALTER TYPE public."managementTypeSimple" OWNER TO "user";

CREATE TYPE public."multiplyStrategyType" AS ENUM (
    'long',
    'short'
);


ALTER TYPE public."multiplyStrategyType" OWNER TO "user";

CREATE TYPE public.network AS ENUM (
    'ethereum',
    'arbitrum',
    'polygon',
    'optimism',
    'base'
);


ALTER TYPE public.network OWNER TO "user";

CREATE TYPE public."networkWithTestnets" AS ENUM (
    'ethereum',
    'ethereum_goerli',
    'arbitrum',
    'arbitrum_goerli',
    'polygon',
    'polygon_mumbai',
    'optimism',
    'optimism_goerli',
    'base',
    'base_goerli'
);


ALTER TYPE public."networkWithTestnets" OWNER TO "user";

CREATE TYPE public.product AS ENUM (
    'borrow',
    'multiply',
    'earn'
);


ALTER TYPE public.product OWNER TO "user";

CREATE TYPE public.protocol AS ENUM (
    'maker',
    'aavev2',
    'aavev3',
    'ajna',
    'sparkv3',
    'morphoblue'
);


ALTER TYPE public.protocol OWNER TO "user";

CREATE TYPE public.vault_type AS ENUM (
    'borrow',
    'multiply',
    'earn'
);


ALTER TYPE public.vault_type OWNER TO "user";

CREATE FUNCTION public.vaultafterinsert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
    INSERT INTO vault_change_log(vault_id, chain_id, token_pair, owner_address, protocol, new_vault_type)
    VALUES (NEW.vault_id, NEW.chain_id, NEW.token_pair, NEW.owner_address, NEW.protocol, NEW.type);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.vaultafterinsert() OWNER TO "user";

CREATE FUNCTION public.vaultafterupdate() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.type <> OLD.type THEN
        INSERT INTO vault_change_log(vault_id, chain_id, token_pair, owner_address, protocol, old_vault_type,
                                     new_vault_type)
        VALUES (NEW.vault_id, NEW.chain_id, new.token_pair, NEW.owner_address, NEW.protocol, OLD.type, NEW.type);
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.vaultafterupdate() OWNER TO "user";

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE public.ajna_rewards_daily_claim (
    id integer NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chain_id integer NOT NULL,
    user_address text NOT NULL,
    amount text NOT NULL,
    week_number integer NOT NULL,
    day_number integer NOT NULL,
    account_address text NOT NULL,
    pool_address text NOT NULL,
    source public.ajna_rewards_source NOT NULL,
    type public.ajna_rewards_position_type NOT NULL
);


ALTER TABLE public.ajna_rewards_daily_claim OWNER TO "user";

CREATE SEQUENCE public.ajna_rewards_daily_claim_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ajna_rewards_daily_claim_id_seq OWNER TO "user";

ALTER SEQUENCE public.ajna_rewards_daily_claim_id_seq OWNED BY public.ajna_rewards_daily_claim.id;


CREATE TABLE public.ajna_rewards_merkle_tree (
    id integer NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chain_id integer NOT NULL,
    week_number integer NOT NULL,
    tree_root text NOT NULL,
    tx_processed boolean DEFAULT false NOT NULL,
    source public.ajna_rewards_source NOT NULL
);


ALTER TABLE public.ajna_rewards_merkle_tree OWNER TO "user";

CREATE SEQUENCE public.ajna_rewards_merkle_tree_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ajna_rewards_merkle_tree_id_seq OWNER TO "user";

ALTER SEQUENCE public.ajna_rewards_merkle_tree_id_seq OWNED BY public.ajna_rewards_merkle_tree.id;


CREATE TABLE public.ajna_rewards_weekly_claim (
    id integer NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chain_id integer NOT NULL,
    user_address text NOT NULL,
    amount text NOT NULL,
    week_number integer NOT NULL,
    proof text[],
    source public.ajna_rewards_source NOT NULL
);


ALTER TABLE public.ajna_rewards_weekly_claim OWNER TO "user";

CREATE SEQUENCE public.ajna_rewards_weekly_claim_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ajna_rewards_weekly_claim_id_seq OWNER TO "user";

ALTER SEQUENCE public.ajna_rewards_weekly_claim_id_seq OWNED BY public.ajna_rewards_weekly_claim.id;


CREATE TABLE public.collateral_type (
    collateral_name text NOT NULL,
    next_price numeric(65,30) NOT NULL,
    current_price numeric(65,30) NOT NULL,
    liquidation_ratio numeric(65,30) NOT NULL,
    liquidation_penalty numeric(65,30) DEFAULT 1.13,
    rate numeric(65,30),
    market_price numeric(65,30)
);


ALTER TABLE public.collateral_type OWNER TO "user";

CREATE TABLE public.discover (
    protocol_id text NOT NULL,
    position_id text NOT NULL,
    collateral_type text NOT NULL,
    vault_normalized_debt numeric(65,30),
    vault_debt numeric(65,30) NOT NULL,
    vault_collateral numeric(65,30) NOT NULL,
    yield_30d numeric(65,30) NOT NULL,
    status jsonb NOT NULL,
    last_action jsonb NOT NULL,
    pnl_all numeric(65,30) NOT NULL,
    pnl_1d numeric(65,30) NOT NULL,
    pnl_7d numeric(65,30) NOT NULL,
    pnl_30d numeric(65,30) NOT NULL,
    pnl_365d numeric(65,30) NOT NULL,
    pnl_ytd numeric(65,30) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    token text,
    vault_type text,
    net_profit_all numeric(65,30),
    net_profit_1d numeric(65,30),
    net_profit_7d numeric(65,30),
    net_profit_30d numeric(65,30),
    net_profit_365d numeric(65,30),
    net_profit_ytd numeric(65,30)
);


ALTER TABLE public.discover OWNER TO "user";

CREATE TABLE public.vault (
    vault_id integer NOT NULL,
    type public.vault_type NOT NULL,
    owner_address character(42) NOT NULL,
    chain_id integer,
    protocol character varying(32) DEFAULT 'maker'::character varying NOT NULL,
    token_pair character varying(32) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.vault OWNER TO "user";

CREATE VIEW public.discover_with_coll_data AS
 SELECT discover.protocol_id,
    discover.position_id,
    discover.collateral_type,
    discover.vault_normalized_debt,
    discover.vault_debt,
    discover.vault_collateral,
    discover.yield_30d,
    discover.status,
    discover.last_action,
    discover.pnl_all,
    discover.pnl_1d,
    discover.pnl_7d,
    discover.pnl_30d,
    discover.pnl_365d,
    discover.pnl_ytd,
    discover."createdAt",
    discover."updatedAt",
    discover.token,
    discover.vault_type,
    discover.net_profit_all,
    discover.net_profit_1d,
    discover.net_profit_7d,
    discover.net_profit_30d,
    discover.net_profit_365d,
    discover.net_profit_ytd,
    collateral_type.collateral_name,
    collateral_type.next_price,
    collateral_type.current_price,
    collateral_type.liquidation_ratio,
    collateral_type.liquidation_penalty,
    collateral_type.rate,
    collateral_type.market_price,
    vault.vault_id,
    vault.type,
    vault.owner_address,
    vault.chain_id
   FROM ((public.discover
     LEFT JOIN public.collateral_type ON ((discover.collateral_type = collateral_type.collateral_name)))
     LEFT JOIN public.vault ON (((discover.position_id)::integer = vault.vault_id)));


ALTER VIEW public.discover_with_coll_data OWNER TO "user";

CREATE VIEW public.high_risk AS
 SELECT protocol_id,
    position_id,
    collateral_type,
    token,
    (vault_collateral * current_price) AS collateral_value,
    ((vault_collateral * current_price) / (vault_normalized_debt * rate)) AS collateral_ratio,
    ((((vault_collateral * current_price) / (vault_normalized_debt * rate)) - liquidation_ratio) / ((vault_collateral * current_price) / (vault_normalized_debt * rate))) AS liquidation_proximity,
    ((liquidation_ratio * (vault_normalized_debt * rate)) / vault_collateral) AS liquidation_price,
    next_price,
    ((vault_normalized_debt * rate) * liquidation_penalty) AS liquidation_value,
    status,
    type
   FROM public.discover_with_coll_data;


ALTER VIEW public.high_risk OWNER TO "user";

CREATE VIEW public.highest_pnl AS
 SELECT protocol_id,
    position_id,
    collateral_type,
    token,
    (vault_collateral * current_price) AS collateral_value,
    ((vault_collateral * current_price) / ((vault_collateral * current_price) - (vault_normalized_debt * rate))) AS vault_multiple,
    pnl_1d,
    pnl_7d,
    pnl_30d,
    pnl_365d,
    pnl_all,
    pnl_ytd,
    net_profit_all,
    net_profit_1d,
    net_profit_7d,
    net_profit_30d,
    net_profit_365d,
    net_profit_ytd,
    last_action,
    type
   FROM public.discover_with_coll_data;


ALTER VIEW public.highest_pnl OWNER TO "user";

CREATE VIEW public.largest_debt AS
 SELECT protocol_id,
    position_id,
    collateral_type,
    token,
    (vault_collateral * current_price) AS collateral_value,
    (vault_normalized_debt * rate) AS vault_debt,
    (((vault_collateral * current_price) / (vault_normalized_debt * rate)) - liquidation_ratio) AS liquidation_proximity,
    ((vault_collateral * current_price) / (vault_normalized_debt * rate)) AS coll_ratio,
    last_action,
    type
   FROM public.discover_with_coll_data;


ALTER VIEW public.largest_debt OWNER TO "user";

CREATE TABLE public.merkle_tree (
    week_number integer NOT NULL,
    tree_root text NOT NULL,
    start_block numeric(78,0),
    end_block numeric(78,0),
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    snapshot text,
    tx_processed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.merkle_tree OWNER TO "user";

CREATE TABLE public.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.migrations OWNER TO "user";

CREATE VIEW public.most_yield AS
 SELECT protocol_id,
    position_id,
    collateral_type,
    token,
    (vault_collateral * current_price) AS collateral_value,
    ((vault_collateral * current_price) - (vault_normalized_debt * rate)) AS net_value,
    ((vault_normalized_debt * rate) * liquidation_penalty) AS liquidation_value,
    net_profit_all AS pnl_all,
    net_profit_1d AS pnl_1d,
    net_profit_7d AS pnl_7d,
    net_profit_30d AS pnl_30d,
    net_profit_365d AS pnl_365d,
    net_profit_ytd AS pnl_ytd,
    yield_30d,
    last_action,
    type
   FROM public.discover_with_coll_data;


ALTER VIEW public.most_yield OWNER TO "user";

CREATE TABLE public.product_hub_items (
    id text NOT NULL,
    label text NOT NULL,
    network public."networkWithTestnets" NOT NULL,
    "primaryToken" text NOT NULL,
    "primaryTokenGroup" text,
    product public.product[],
    protocol public.protocol NOT NULL,
    "secondaryToken" text NOT NULL,
    "secondaryTokenGroup" text,
    "weeklyNetApy" text,
    "depositToken" text,
    fee text,
    liquidity text,
    "managementType" public."managementTypeSimple",
    "maxLtv" text,
    "maxMultiply" text,
    "multiplyStrategy" text,
    "multiplyStrategyType" public."multiplyStrategyType",
    "reverseTokens" boolean,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    tooltips jsonb,
    "primaryTokenAddress" text DEFAULT '0x0000000000000000000000000000000000000000'::text NOT NULL,
    "secondaryTokenAddress" text DEFAULT '0x0000000000000000000000000000000000000000'::text NOT NULL,
    "hasRewards" boolean DEFAULT false NOT NULL,
    "earnStrategyDescription" text,
    "earnStrategy" public."earnStrategies",
    "automationFeatures" public."automationFeature"[]
);


ALTER TABLE public.product_hub_items OWNER TO "user";

CREATE TABLE public.tokens (
    address text NOT NULL,
    name text NOT NULL,
    symbol text NOT NULL,
    "precision" integer NOT NULL,
    chain_id integer NOT NULL,
    source character varying
);


ALTER TABLE public.tokens OWNER TO "user";

CREATE TABLE public.tos_approval (
    id integer NOT NULL,
    address character varying(66) NOT NULL,
    doc_version character varying NOT NULL,
    sign_date timestamp without time zone NOT NULL,
    signature character varying DEFAULT '0x0'::character varying NOT NULL,
    message character varying DEFAULT '0x0'::character varying NOT NULL,
    chain_id integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.tos_approval OWNER TO "user";

CREATE SEQUENCE public.tos_approval_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tos_approval_id_seq OWNER TO "user";

ALTER SEQUENCE public.tos_approval_id_seq OWNED BY public.tos_approval.id;


CREATE TABLE public."user" (
    address text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_that_referred_address text,
    accepted boolean NOT NULL
);


ALTER TABLE public."user" OWNER TO "user";

CREATE TABLE public.users_who_follow_vaults (
    user_address text NOT NULL,
    vault_id integer NOT NULL,
    vault_chain_id integer NOT NULL,
    protocol public.protocol NOT NULL
);


ALTER TABLE public.users_who_follow_vaults OWNER TO "user";

CREATE TABLE public.vault_change_log (
    id integer NOT NULL,
    vault_id integer NOT NULL,
    chain_id integer NOT NULL,
    token_pair character varying(32) NOT NULL,
    owner_address character(42) NOT NULL,
    protocol character varying(32) NOT NULL,
    old_vault_type public.vault_type,
    new_vault_type public.vault_type,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.vault_change_log OWNER TO "user";

CREATE SEQUENCE public.vault_change_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vault_change_log_id_seq OWNER TO "user";

ALTER SEQUENCE public.vault_change_log_id_seq OWNED BY public.vault_change_log.id;


CREATE TABLE public.wallet_risk (
    address character varying(66) NOT NULL,
    last_check timestamp without time zone NOT NULL,
    is_risky boolean NOT NULL
);


ALTER TABLE public.wallet_risk OWNER TO "user";

CREATE TABLE public.weekly_claim (
    id integer NOT NULL,
    week_number integer NOT NULL,
    user_address text NOT NULL,
    proof text[],
    amount text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.weekly_claim OWNER TO "user";

CREATE SEQUENCE public.weekly_claim_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.weekly_claim_id_seq OWNER TO "user";

ALTER SEQUENCE public.weekly_claim_id_seq OWNED BY public.weekly_claim.id;


ALTER TABLE ONLY public.ajna_rewards_daily_claim ALTER COLUMN id SET DEFAULT nextval('public.ajna_rewards_daily_claim_id_seq'::regclass);


ALTER TABLE ONLY public.ajna_rewards_merkle_tree ALTER COLUMN id SET DEFAULT nextval('public.ajna_rewards_merkle_tree_id_seq'::regclass);


ALTER TABLE ONLY public.ajna_rewards_weekly_claim ALTER COLUMN id SET DEFAULT nextval('public.ajna_rewards_weekly_claim_id_seq'::regclass);


ALTER TABLE ONLY public.tos_approval ALTER COLUMN id SET DEFAULT nextval('public.tos_approval_id_seq'::regclass);


ALTER TABLE ONLY public.vault_change_log ALTER COLUMN id SET DEFAULT nextval('public.vault_change_log_id_seq'::regclass);


ALTER TABLE ONLY public.weekly_claim ALTER COLUMN id SET DEFAULT nextval('public.weekly_claim_id_seq'::regclass);

INSERT INTO public.migrations VALUES (0, 'create-migrations-table', 'e18db593bcde2aca2a408c4d1100f6abba2195df', '2024-07-10 14:52:59.801189');
INSERT INTO public.migrations VALUES (1, 'tos-approval', '3a8e900b0f7b883e948ff700c8443ff8fcd1e194', '2024-07-10 14:52:59.806845');
INSERT INTO public.migrations VALUES (2, 'vault', 'a3cd165ce845dc74230dea31cb0fb84e7c7d8f4e', '2024-07-10 14:52:59.812553');
INSERT INTO public.migrations VALUES (3, 'chain-id', '39ec27e6adf2bb39a4b4f6d0c71e85e383dd4615', '2024-07-10 14:52:59.816214');
INSERT INTO public.migrations VALUES (4, 'vault_id_chain_id_constraint', 'eb35fb1460c2d1f89effbf776409e9e2593e924b', '2024-07-10 14:52:59.818082');
INSERT INTO public.migrations VALUES (5, 'vault_drop_unique_index', '5a40c735aa8c7b7053094b15a3925c3d66e7cdc0', '2024-07-10 14:52:59.820823');
INSERT INTO public.migrations VALUES (6, 'referrals', '7303b11e07dcdedd0853e285ebd5b17718df4a4c', '2024-07-10 14:52:59.822728');
INSERT INTO public.migrations VALUES (7, 'tos-challange-and-signature', 'e9dc48b94656606d3ba488a89589d7bc2dff8a19', '2024-07-10 14:52:59.833953');
INSERT INTO public.migrations VALUES (8, 'wallet-risk', 'aa2f8ff6698fca3f2605543f23fc1f89ff16bb41', '2024-07-10 14:52:59.835864');
INSERT INTO public.migrations VALUES (9, 'referral-changes', '73e479a2d4cc77c5f8b1e6f8d630895373cf767d', '2024-07-10 14:52:59.838282');
INSERT INTO public.migrations VALUES (10, 'discover', 'af28dce60f976b548878f5276b8b9bfe14a5d472', '2024-07-10 14:52:59.840422');
INSERT INTO public.migrations VALUES (11, 'modify-dicover', 'a8ad0f92c56846942dd0f71a085b62a8bffe8204', '2024-07-10 14:52:59.848587');
INSERT INTO public.migrations VALUES (12, 'add-liquidation-proximity', '94633e25d7aa62eb4f098d52d49f2148bb83fa79', '2024-07-10 14:52:59.853797');
INSERT INTO public.migrations VALUES (13, 'update-liquidation-proimity', '1f28d77fdca121e0b80d789686619d9980ed7410', '2024-07-10 14:52:59.855905');
INSERT INTO public.migrations VALUES (14, 'discover-new-columns', '37104c2aa3c64606d259f28cfd3b5c4b26b4ec1e', '2024-07-10 14:52:59.857916');
INSERT INTO public.migrations VALUES (15, 'users-who-follow-vault', '4f76a65c7656a8e35ee499e039f427b78bf32ea7', '2024-07-10 14:52:59.863411');
INSERT INTO public.migrations VALUES (16, 'update-discover', '36fcb83ae6afd503e9d2cc05a969eb8cd123f5a8', '2024-07-10 14:52:59.868848');
INSERT INTO public.migrations VALUES (17, 'refactor-follow', 'dfb226975c04de75d5c9ae8142052f4f3f522cd2', '2024-07-10 14:52:59.871089');
INSERT INTO public.migrations VALUES (18, 'drop-constraint', '074cb1bfe6c4efcf8a43be297f9fa7c218a837a1', '2024-07-10 14:52:59.873049');
INSERT INTO public.migrations VALUES (19, 'follow-add-protocol', '30b9371d47ce8f05fae4997521c7bde73219c080', '2024-07-10 14:52:59.874765');
INSERT INTO public.migrations VALUES (20, 'add-protocol-to-vault', '942efee8b71193f72b8da6238c3095886aef5250', '2024-07-10 14:52:59.877753');
INSERT INTO public.migrations VALUES (21, 'product-hub-items', 'd1f3a74eca5237a6fd80ad167a8a9b04d893eb04', '2024-07-10 14:52:59.881719');
INSERT INTO public.migrations VALUES (22, 'product-hub-items-update', 'a6f888a46c852ab2082c7c2bbe572e9561f6ea3a', '2024-07-10 14:52:59.887162');
INSERT INTO public.migrations VALUES (23, 'product-hub-items-testnets', '361ce047649422189913352364613b630aed4d21', '2024-07-10 14:52:59.892884');
INSERT INTO public.migrations VALUES (24, 'product-hub-add-tooltips', 'b75d4a69846ad25ed0f832df0a853f0a9ae05a5e', '2024-07-10 14:52:59.899596');
INSERT INTO public.migrations VALUES (25, 'ajna-rewards', '74087ba7431f53d5c95e18013b2657b857738f1c', '2024-07-10 14:52:59.900889');
INSERT INTO public.migrations VALUES (26, 'tokens', '8a30b6de01a33e6028d53ebb9cf273e884ca85e7', '2024-07-10 14:52:59.912588');
INSERT INTO public.migrations VALUES (27, 'vault-type-earn', 'd9648986e73965180fed888ed04b5940e42787ec', '2024-07-10 14:52:59.915842');
INSERT INTO public.migrations VALUES (28, 'alter-referrals', '47eed912c89bf8f9875cbaf7ece4e3b48a729341', '2024-07-10 14:52:59.917064');
INSERT INTO public.migrations VALUES (29, 'tokens-source', '1d7f80b23d12c5a036efadaa8bfb825752faac50', '2024-07-10 14:52:59.918465');
INSERT INTO public.migrations VALUES (30, 'product-hub-add-token-address', '422cb67ea0ca45a38f7e5d2ffe70880b5fb545b6', '2024-07-10 14:52:59.919773');
INSERT INTO public.migrations VALUES (31, 'spark-protocol', 'eaccf41051fb32c5ba237eb8c2a385e497520337', '2024-07-10 14:52:59.921277');
INSERT INTO public.migrations VALUES (32, 'product-hub-rewards', '0851e4174e59b95a4b0dfb07a1e096b8759a7d82', '2024-07-10 14:52:59.922459');
INSERT INTO public.migrations VALUES (33, 'morpho-blue-protocol', '6416c7663be5445c92302ff3f40d8b8d88e397b1', '2024-07-10 14:52:59.924334');
INSERT INTO public.migrations VALUES (34, 'base-network', '5f1de69023d00bc2170feda0abfde66d88922bbc', '2024-07-10 14:52:59.925433');
INSERT INTO public.migrations VALUES (35, 'add-token-pair-to-vault', '0976c639f6a9afeb6aa37191a3f341d7e51ab801', '2024-07-10 14:52:59.926699');
INSERT INTO public.migrations VALUES (36, 'modify-ajna-rewards', 'c3080d60f443b331de3ffbd1d058c8c312a91852', '2024-07-10 14:52:59.930737');
INSERT INTO public.migrations VALUES (37, 'vault-type-changelog', 'bb9256261389bc86f1be9bd9bfbcb727579cc654', '2024-07-10 14:52:59.936136');
INSERT INTO public.migrations VALUES (38, 'earn-strategies-erc-4626', 'be2ef7349e84b68fcca2185899d7036cc10f7109', '2024-07-10 14:52:59.940822');
INSERT INTO public.migrations VALUES (39, 'product-hub-automation-feature', '71210677dea04c432421ee5cadfffed60a1ec831', '2024-07-10 14:52:59.942143');

SELECT pg_catalog.setval('public.ajna_rewards_daily_claim_id_seq', 1, false);


SELECT pg_catalog.setval('public.ajna_rewards_merkle_tree_id_seq', 1, false);


SELECT pg_catalog.setval('public.ajna_rewards_weekly_claim_id_seq', 1, false);


SELECT pg_catalog.setval('public.tos_approval_id_seq', 1, false);


SELECT pg_catalog.setval('public.vault_change_log_id_seq', 1, false);


SELECT pg_catalog.setval('public.weekly_claim_id_seq', 1, false);


ALTER TABLE ONLY public.ajna_rewards_daily_claim
    ADD CONSTRAINT ajna_rewards_daily_claim_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.ajna_rewards_merkle_tree
    ADD CONSTRAINT ajna_rewards_merkle_tree_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.ajna_rewards_weekly_claim
    ADD CONSTRAINT ajna_rewards_weekly_claim_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.collateral_type
    ADD CONSTRAINT collateral_name_key PRIMARY KEY (collateral_name);


ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.product_hub_items
    ADD CONSTRAINT product_hub_items_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.tos_approval
    ADD CONSTRAINT tos_approval_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.users_who_follow_vaults
    ADD CONSTRAINT users_who_follow_vaults_pkey PRIMARY KEY (user_address, vault_id, vault_chain_id, protocol);


ALTER TABLE ONLY public.vault_change_log
    ADD CONSTRAINT vault_change_log_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.vault
    ADD CONSTRAINT vault_unique_constraint UNIQUE (vault_id, chain_id, protocol, token_pair, owner_address);


ALTER TABLE ONLY public.weekly_claim
    ADD CONSTRAINT weekly_claim_pkey PRIMARY KEY (id);


CREATE UNIQUE INDEX ajna_rewards_daily_claim_day_number_pool_address_account_ad_key ON public.ajna_rewards_daily_claim USING btree (day_number, pool_address, account_address, chain_id, source, type);


CREATE UNIQUE INDEX ajna_rewards_merkle_tree_week_number_chain_id_source_key ON public.ajna_rewards_merkle_tree USING btree (week_number, chain_id, source);


CREATE UNIQUE INDEX ajna_rewards_weekly_claim_week_number_user_address_chain_id_key ON public.ajna_rewards_weekly_claim USING btree (week_number, user_address, chain_id, source);


CREATE UNIQUE INDEX discover_protocol_id_position_id_key ON public.discover USING btree (protocol_id, position_id);


CREATE UNIQUE INDEX merkle_tree_week_number_key ON public.merkle_tree USING btree (week_number);


CREATE UNIQUE INDEX "product_hub_items_label_network_product_protocol_primaryTok_key" ON public.product_hub_items USING btree (label, network, product, protocol, "primaryToken", "secondaryToken");


CREATE UNIQUE INDEX tokens_address_chain_id_key ON public.tokens USING btree (address, chain_id);


CREATE UNIQUE INDEX tos_approval_address_chain_id_doc_version_key ON public.tos_approval USING btree (address, chain_id, doc_version);


CREATE UNIQUE INDEX tos_approval_unique_signature ON public.tos_approval USING btree (address, doc_version);


CREATE UNIQUE INDEX user_address_key ON public."user" USING btree (address);


CREATE UNIQUE INDEX wallet_risk_unique_index ON public.wallet_risk USING btree (address);


CREATE UNIQUE INDEX weekly_claim_week_number_user_address_key ON public.weekly_claim USING btree (week_number, user_address);


CREATE TRIGGER vaultafterinsert AFTER INSERT ON public.vault FOR EACH ROW EXECUTE FUNCTION public.vaultafterinsert();


CREATE TRIGGER vaultafterupdate AFTER UPDATE ON public.vault FOR EACH ROW EXECUTE FUNCTION public.vaultafterupdate();


ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_user_that_referred_address_fkey FOREIGN KEY (user_that_referred_address) REFERENCES public."user"(address) ON UPDATE CASCADE ON DELETE SET NULL;


ALTER TABLE ONLY public.weekly_claim
    ADD CONSTRAINT weekly_claim_user_address_fkey FOREIGN KEY (user_address) REFERENCES public."user"(address) ON UPDATE CASCADE ON DELETE RESTRICT;


