--
-- PostgreSQL database dump
--

-- Dumped from database version 12.22 (Debian 12.22-1.pgdg120+1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: ajna_rewards_position_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.ajna_rewards_position_type AS ENUM (
    'earn',
    'borrow'
);


--
-- Name: ajna_rewards_source; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.ajna_rewards_source AS ENUM (
    'core',
    'bonus'
);


--
-- Name: automationFeature; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."automationFeature" AS ENUM (
    'stopLoss',
    'trailingStopLoss',
    'autoBuy',
    'autoSell',
    'autoTakeProfit',
    'partialTakeProfit',
    'constantMultiple'
);


--
-- Name: earnStrategies; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."earnStrategies" AS ENUM (
    'liquidity_provision',
    'yield_loop',
    'other',
    'erc_4626'
);


--
-- Name: managementType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."managementType" AS ENUM (
    'active',
    'active_with_liq_risk',
    'passive'
);


--
-- Name: managementTypeSimple; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."managementTypeSimple" AS ENUM (
    'active',
    'passive'
);


--
-- Name: multiplyStrategyType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."multiplyStrategyType" AS ENUM (
    'long',
    'short'
);


--
-- Name: network; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.network AS ENUM (
    'ethereum',
    'arbitrum',
    'polygon',
    'optimism',
    'base'
);


--
-- Name: networkWithTestnets; Type: TYPE; Schema: public; Owner: -
--

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


--
-- Name: product; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.product AS ENUM (
    'borrow',
    'multiply',
    'earn'
);


--
-- Name: protocol; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.protocol AS ENUM (
    'maker',
    'aavev2',
    'aavev3',
    'ajna',
    'sparkv3',
    'morphoblue',
    'sky'
);


--
-- Name: vault_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.vault_type AS ENUM (
    'borrow',
    'multiply',
    'earn'
);


--
-- Name: vaultafterinsert(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.vaultafterinsert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
    INSERT INTO vault_change_log(vault_id, chain_id, token_pair, owner_address, protocol, new_vault_type)
    VALUES (NEW.vault_id, NEW.chain_id, NEW.token_pair, NEW.owner_address, NEW.protocol, NEW.type);
    RETURN NEW;
END;
$$;


--
-- Name: vaultafterupdate(); Type: FUNCTION; Schema: public; Owner: -
--

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


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ajna_rewards_daily_claim; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: ajna_rewards_daily_claim_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ajna_rewards_daily_claim_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ajna_rewards_daily_claim_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ajna_rewards_daily_claim_id_seq OWNED BY public.ajna_rewards_daily_claim.id;


--
-- Name: ajna_rewards_merkle_tree; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ajna_rewards_merkle_tree (
    id integer NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    chain_id integer NOT NULL,
    week_number integer NOT NULL,
    tree_root text NOT NULL,
    tx_processed boolean DEFAULT false NOT NULL,
    source public.ajna_rewards_source NOT NULL
);


--
-- Name: ajna_rewards_merkle_tree_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ajna_rewards_merkle_tree_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ajna_rewards_merkle_tree_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ajna_rewards_merkle_tree_id_seq OWNED BY public.ajna_rewards_merkle_tree.id;


--
-- Name: ajna_rewards_weekly_claim; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: ajna_rewards_weekly_claim_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ajna_rewards_weekly_claim_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ajna_rewards_weekly_claim_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ajna_rewards_weekly_claim_id_seq OWNED BY public.ajna_rewards_weekly_claim.id;


--
-- Name: collateral_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collateral_type (
    collateral_name text NOT NULL,
    next_price numeric(65,30) NOT NULL,
    current_price numeric(65,30) NOT NULL,
    liquidation_ratio numeric(65,30) NOT NULL,
    liquidation_penalty numeric(65,30) DEFAULT 1.13,
    rate numeric(65,30),
    market_price numeric(65,30)
);


--
-- Name: discover; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: vault; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vault (
    vault_id integer NOT NULL,
    type public.vault_type NOT NULL,
    owner_address character(42) NOT NULL,
    chain_id integer,
    protocol character varying(32) DEFAULT 'maker'::character varying NOT NULL,
    token_pair character varying(32) DEFAULT ''::character varying NOT NULL
);


--
-- Name: discover_with_coll_data; Type: VIEW; Schema: public; Owner: -
--

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


--
-- Name: high_risk; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.high_risk AS
 SELECT discover_with_coll_data.protocol_id,
    discover_with_coll_data.position_id,
    discover_with_coll_data.collateral_type,
    discover_with_coll_data.token,
    (discover_with_coll_data.vault_collateral * discover_with_coll_data.current_price) AS collateral_value,
    ((discover_with_coll_data.vault_collateral * discover_with_coll_data.current_price) / (discover_with_coll_data.vault_normalized_debt * discover_with_coll_data.rate)) AS collateral_ratio,
    ((((discover_with_coll_data.vault_collateral * discover_with_coll_data.current_price) / (discover_with_coll_data.vault_normalized_debt * discover_with_coll_data.rate)) - discover_with_coll_data.liquidation_ratio) / ((discover_with_coll_data.vault_collateral * discover_with_coll_data.current_price) / (discover_with_coll_data.vault_normalized_debt * discover_with_coll_data.rate))) AS liquidation_proximity,
    ((discover_with_coll_data.liquidation_ratio * (discover_with_coll_data.vault_normalized_debt * discover_with_coll_data.rate)) / discover_with_coll_data.vault_collateral) AS liquidation_price,
    discover_with_coll_data.next_price,
    ((discover_with_coll_data.vault_normalized_debt * discover_with_coll_data.rate) * discover_with_coll_data.liquidation_penalty) AS liquidation_value,
    discover_with_coll_data.status,
    discover_with_coll_data.type
   FROM public.discover_with_coll_data;


--
-- Name: highest_pnl; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.highest_pnl AS
 SELECT discover_with_coll_data.protocol_id,
    discover_with_coll_data.position_id,
    discover_with_coll_data.collateral_type,
    discover_with_coll_data.token,
    (discover_with_coll_data.vault_collateral * discover_with_coll_data.current_price) AS collateral_value,
    ((discover_with_coll_data.vault_collateral * discover_with_coll_data.current_price) / ((discover_with_coll_data.vault_collateral * discover_with_coll_data.current_price) - (discover_with_coll_data.vault_normalized_debt * discover_with_coll_data.rate))) AS vault_multiple,
    discover_with_coll_data.pnl_1d,
    discover_with_coll_data.pnl_7d,
    discover_with_coll_data.pnl_30d,
    discover_with_coll_data.pnl_365d,
    discover_with_coll_data.pnl_all,
    discover_with_coll_data.pnl_ytd,
    discover_with_coll_data.net_profit_all,
    discover_with_coll_data.net_profit_1d,
    discover_with_coll_data.net_profit_7d,
    discover_with_coll_data.net_profit_30d,
    discover_with_coll_data.net_profit_365d,
    discover_with_coll_data.net_profit_ytd,
    discover_with_coll_data.last_action,
    discover_with_coll_data.type
   FROM public.discover_with_coll_data;


--
-- Name: largest_debt; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.largest_debt AS
 SELECT discover_with_coll_data.protocol_id,
    discover_with_coll_data.position_id,
    discover_with_coll_data.collateral_type,
    discover_with_coll_data.token,
    (discover_with_coll_data.vault_collateral * discover_with_coll_data.current_price) AS collateral_value,
    (discover_with_coll_data.vault_normalized_debt * discover_with_coll_data.rate) AS vault_debt,
    (((discover_with_coll_data.vault_collateral * discover_with_coll_data.current_price) / (discover_with_coll_data.vault_normalized_debt * discover_with_coll_data.rate)) - discover_with_coll_data.liquidation_ratio) AS liquidation_proximity,
    ((discover_with_coll_data.vault_collateral * discover_with_coll_data.current_price) / (discover_with_coll_data.vault_normalized_debt * discover_with_coll_data.rate)) AS coll_ratio,
    discover_with_coll_data.last_action,
    discover_with_coll_data.type
   FROM public.discover_with_coll_data;


--
-- Name: merkle_tree; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.merkle_tree (
    week_number integer NOT NULL,
    tree_root text NOT NULL,
    start_block numeric(78,0),
    end_block numeric(78,0),
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    snapshot text,
    tx_processed boolean DEFAULT false NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: most_yield; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.most_yield AS
 SELECT discover_with_coll_data.protocol_id,
    discover_with_coll_data.position_id,
    discover_with_coll_data.collateral_type,
    discover_with_coll_data.token,
    (discover_with_coll_data.vault_collateral * discover_with_coll_data.current_price) AS collateral_value,
    ((discover_with_coll_data.vault_collateral * discover_with_coll_data.current_price) - (discover_with_coll_data.vault_normalized_debt * discover_with_coll_data.rate)) AS net_value,
    ((discover_with_coll_data.vault_normalized_debt * discover_with_coll_data.rate) * discover_with_coll_data.liquidation_penalty) AS liquidation_value,
    discover_with_coll_data.net_profit_all AS pnl_all,
    discover_with_coll_data.net_profit_1d AS pnl_1d,
    discover_with_coll_data.net_profit_7d AS pnl_7d,
    discover_with_coll_data.net_profit_30d AS pnl_30d,
    discover_with_coll_data.net_profit_365d AS pnl_365d,
    discover_with_coll_data.net_profit_ytd AS pnl_ytd,
    discover_with_coll_data.yield_30d,
    discover_with_coll_data.last_action,
    discover_with_coll_data.type
   FROM public.discover_with_coll_data;


--
-- Name: product_hub_items; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: rays_daily_challenge; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rays_daily_challenge (
    id integer NOT NULL,
    address text NOT NULL,
    claimed_dates text[]
);


--
-- Name: rays_daily_challenge_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rays_daily_challenge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rays_daily_challenge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rays_daily_challenge_id_seq OWNED BY public.rays_daily_challenge.id;


--
-- Name: tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tokens (
    address text NOT NULL,
    name text NOT NULL,
    symbol text NOT NULL,
    "precision" integer NOT NULL,
    chain_id integer NOT NULL,
    source character varying
);


--
-- Name: tos_approval; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tos_approval (
    id integer NOT NULL,
    address character varying(66) NOT NULL,
    doc_version character varying NOT NULL,
    sign_date timestamp without time zone NOT NULL,
    signature character varying DEFAULT '0x0'::character varying NOT NULL,
    message character varying DEFAULT '0x0'::character varying NOT NULL,
    chain_id integer DEFAULT 0 NOT NULL
);


--
-- Name: tos_approval_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tos_approval_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tos_approval_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tos_approval_id_seq OWNED BY public.tos_approval.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    address text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_that_referred_address text,
    accepted boolean NOT NULL
);


--
-- Name: users_who_follow_vaults; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_who_follow_vaults (
    user_address text NOT NULL,
    vault_id integer NOT NULL,
    vault_chain_id integer NOT NULL,
    protocol public.protocol NOT NULL
);


--
-- Name: vault_change_log; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: vault_change_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vault_change_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vault_change_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vault_change_log_id_seq OWNED BY public.vault_change_log.id;


--
-- Name: wallet_risk; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wallet_risk (
    address character varying(66) NOT NULL,
    last_check timestamp without time zone NOT NULL,
    is_risky boolean NOT NULL
);


--
-- Name: weekly_claim; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.weekly_claim (
    id integer NOT NULL,
    week_number integer NOT NULL,
    user_address text NOT NULL,
    proof text[],
    amount text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: weekly_claim_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.weekly_claim_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: weekly_claim_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.weekly_claim_id_seq OWNED BY public.weekly_claim.id;


--
-- Name: ajna_rewards_daily_claim id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ajna_rewards_daily_claim ALTER COLUMN id SET DEFAULT nextval('public.ajna_rewards_daily_claim_id_seq'::regclass);


--
-- Name: ajna_rewards_merkle_tree id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ajna_rewards_merkle_tree ALTER COLUMN id SET DEFAULT nextval('public.ajna_rewards_merkle_tree_id_seq'::regclass);


--
-- Name: ajna_rewards_weekly_claim id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ajna_rewards_weekly_claim ALTER COLUMN id SET DEFAULT nextval('public.ajna_rewards_weekly_claim_id_seq'::regclass);


--
-- Name: rays_daily_challenge id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rays_daily_challenge ALTER COLUMN id SET DEFAULT nextval('public.rays_daily_challenge_id_seq'::regclass);


--
-- Name: tos_approval id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tos_approval ALTER COLUMN id SET DEFAULT nextval('public.tos_approval_id_seq'::regclass);


--
-- Name: vault_change_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vault_change_log ALTER COLUMN id SET DEFAULT nextval('public.vault_change_log_id_seq'::regclass);


--
-- Name: weekly_claim id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weekly_claim ALTER COLUMN id SET DEFAULT nextval('public.weekly_claim_id_seq'::regclass);


--
-- Name: ajna_rewards_daily_claim ajna_rewards_daily_claim_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ajna_rewards_daily_claim
    ADD CONSTRAINT ajna_rewards_daily_claim_pkey PRIMARY KEY (id);


--
-- Name: ajna_rewards_merkle_tree ajna_rewards_merkle_tree_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ajna_rewards_merkle_tree
    ADD CONSTRAINT ajna_rewards_merkle_tree_pkey PRIMARY KEY (id);


--
-- Name: ajna_rewards_weekly_claim ajna_rewards_weekly_claim_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ajna_rewards_weekly_claim
    ADD CONSTRAINT ajna_rewards_weekly_claim_pkey PRIMARY KEY (id);


--
-- Name: collateral_type collateral_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collateral_type
    ADD CONSTRAINT collateral_name_key PRIMARY KEY (collateral_name);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: product_hub_items product_hub_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_hub_items
    ADD CONSTRAINT product_hub_items_pkey PRIMARY KEY (id);


--
-- Name: rays_daily_challenge rays_daily_challenge_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rays_daily_challenge
    ADD CONSTRAINT rays_daily_challenge_pkey PRIMARY KEY (id);


--
-- Name: tos_approval tos_approval_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tos_approval
    ADD CONSTRAINT tos_approval_pkey PRIMARY KEY (id);


--
-- Name: users_who_follow_vaults users_who_follow_vaults_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_who_follow_vaults
    ADD CONSTRAINT users_who_follow_vaults_pkey PRIMARY KEY (user_address, vault_id, vault_chain_id, protocol);


--
-- Name: vault_change_log vault_change_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vault_change_log
    ADD CONSTRAINT vault_change_log_pkey PRIMARY KEY (id);


--
-- Name: vault vault_unique_constraint; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vault
    ADD CONSTRAINT vault_unique_constraint UNIQUE (vault_id, chain_id, protocol, token_pair, owner_address);


--
-- Name: weekly_claim weekly_claim_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weekly_claim
    ADD CONSTRAINT weekly_claim_pkey PRIMARY KEY (id);


--
-- Name: ajna_rewards_daily_claim_day_number_pool_address_account_ad_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ajna_rewards_daily_claim_day_number_pool_address_account_ad_key ON public.ajna_rewards_daily_claim USING btree (day_number, pool_address, account_address, chain_id, source, type);


--
-- Name: ajna_rewards_merkle_tree_week_number_chain_id_source_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ajna_rewards_merkle_tree_week_number_chain_id_source_key ON public.ajna_rewards_merkle_tree USING btree (week_number, chain_id, source);


--
-- Name: ajna_rewards_weekly_claim_week_number_user_address_chain_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ajna_rewards_weekly_claim_week_number_user_address_chain_id_key ON public.ajna_rewards_weekly_claim USING btree (week_number, user_address, chain_id, source);


--
-- Name: discover_protocol_id_position_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX discover_protocol_id_position_id_key ON public.discover USING btree (protocol_id, position_id);


--
-- Name: merkle_tree_week_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX merkle_tree_week_number_key ON public.merkle_tree USING btree (week_number);


--
-- Name: product_hub_items_label_network_product_protocol_primaryTok_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "product_hub_items_label_network_product_protocol_primaryTok_key" ON public.product_hub_items USING btree (label, network, product, protocol, "primaryToken", "secondaryToken");


--
-- Name: rays_daily_challenge_address_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX rays_daily_challenge_address_key ON public.rays_daily_challenge USING btree (address);


--
-- Name: tokens_address_chain_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tokens_address_chain_id_key ON public.tokens USING btree (address, chain_id);


--
-- Name: tos_approval_address_chain_id_doc_version_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tos_approval_address_chain_id_doc_version_key ON public.tos_approval USING btree (address, chain_id, doc_version);


--
-- Name: tos_approval_unique_signature; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tos_approval_unique_signature ON public.tos_approval USING btree (address, doc_version);


--
-- Name: user_address_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_address_key ON public."user" USING btree (address);


--
-- Name: wallet_risk_unique_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX wallet_risk_unique_index ON public.wallet_risk USING btree (address);


--
-- Name: weekly_claim_week_number_user_address_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX weekly_claim_week_number_user_address_key ON public.weekly_claim USING btree (week_number, user_address);


--
-- Name: vault vaultafterinsert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER vaultafterinsert AFTER INSERT ON public.vault FOR EACH ROW EXECUTE FUNCTION public.vaultafterinsert();


--
-- Name: vault vaultafterupdate; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER vaultafterupdate AFTER UPDATE ON public.vault FOR EACH ROW EXECUTE FUNCTION public.vaultafterupdate();


--
-- Name: user user_user_that_referred_address_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_user_that_referred_address_fkey FOREIGN KEY (user_that_referred_address) REFERENCES public."user"(address) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: weekly_claim weekly_claim_user_address_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weekly_claim
    ADD CONSTRAINT weekly_claim_user_address_fkey FOREIGN KEY (user_address) REFERENCES public."user"(address) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

