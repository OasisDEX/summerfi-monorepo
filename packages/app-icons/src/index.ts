/// <reference types="vite-plugin-svgr/client" />
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable camelcase */

import { FunctionComponent, lazy, LazyExoticComponent, SVGProps } from 'react'

const customLazy = (importFn: () => Promise<typeof import('*.svg?react')>) =>
  lazy(async () => ({ default: (await importFn()).default }))

// this is redeclared here to avoid importing react types in the app-icons package (isolatedDeclarations: true issue)
type IconExportType = LazyExoticComponent<
  FunctionComponent<
    SVGProps<SVGSVGElement> & {
      title?: string
    }
  >
>

export const icons = {
  aave_cbETH_usdc: customLazy(() => import('./icons/aave_cbETH_usdc.svg?react')) as IconExportType,
  aave_circle_color: customLazy(
    () => import('./icons/aave_circle_color.svg?react'),
  ) as IconExportType,
  aave_eth_usdc: customLazy(() => import('./icons/aave_eth_usdc.svg?react')) as IconExportType,
  aave_steth_eth: customLazy(() => import('./icons/aave_steth_eth.svg?react')) as IconExportType,
  aave_steth_usdc: customLazy(() => import('./icons/aave_steth_usdc.svg?react')) as IconExportType,
  aave_wbtc_usdc: customLazy(() => import('./icons/aave_wbtc_usdc.svg?react')) as IconExportType,
  aero: customLazy(() => import('./icons/aero.svg?react')) as IconExportType,
  ajna_circle_color: customLazy(
    () => import('./icons/ajna_circle_color.svg?react'),
  ) as IconExportType,
  apxeth_circle_color: customLazy(
    () => import('./icons/apxeth_circle_color.svg?react'),
  ) as IconExportType,
  arb_circle: customLazy(() => import('./icons/arb_circle.svg?react')) as IconExportType,
  arb: customLazy(() => import('./icons/arb.svg?react')) as IconExportType,
  arrow_backward: customLazy(() => import('./icons/arrow_backward.svg?react')) as IconExportType,
  arrow_decrease: customLazy(() => import('./icons/arrow_decrease.svg?react')) as IconExportType,
  arrow_forward: customLazy(() => import('./icons/arrow_forward.svg?react')) as IconExportType,
  arrow_forward_colorful: customLazy(
    () => import('./icons/arrow_forward_colorful.svg?react'),
  ) as IconExportType,
  arrow_increase: customLazy(() => import('./icons/arrow_increase.svg?react')) as IconExportType,
  augur_circle_color: customLazy(
    () => import('./icons/augur_circle_color.svg?react'),
  ) as IconExportType,
  augur_color: customLazy(() => import('./icons/augur_color.svg?react')) as IconExportType,
  augur: customLazy(() => import('./icons/augur.svg?react')) as IconExportType,
  autoBuy: customLazy(() => import('./icons/autoBuy.svg?react')) as IconExportType,
  autoSell: customLazy(() => import('./icons/autoSell.svg?react')) as IconExportType,
  autoTakeProfit: customLazy(() => import('./icons/takeProfit.svg?react')) as IconExportType,
  bal_circle_color: customLazy(
    () => import('./icons/bal_circle_color.svg?react'),
  ) as IconExportType,
  bal_circle: customLazy(() => import('./icons/bal_circle.svg?react')) as IconExportType,
  bal: customLazy(() => import('./icons/bal.svg?react')) as IconExportType,
  base: customLazy(() => import('./icons/base.svg?react')) as IconExportType,
  base_circle: customLazy(() => import('./icons/base_circle.svg?react')) as IconExportType,
  bat_circle_color: customLazy(
    () => import('./icons/bat_circle_color.svg?react'),
  ) as IconExportType,
  bat_color: customLazy(() => import('./icons/bat_color.svg?react')) as IconExportType,
  bat: customLazy(() => import('./icons/bat.svg?react')) as IconExportType,
  beach_club_icon: customLazy(() => import('./icons/beach_club_icon.svg?react')) as IconExportType,
  beach_club_rewards: customLazy(
    () => import('./icons/beach_club_rewards.svg?react'),
  ) as IconExportType,
  bridge: customLazy(() => import('./icons/bridge.svg?react')) as IconExportType,
  big_certificate: customLazy(() => import('./icons/big_certificate.svg?react')) as IconExportType,
  big_press: customLazy(() => import('./icons/big_press.svg?react')) as IconExportType,
  big_pot: customLazy(() => import('./icons/big_pot.svg?react')) as IconExportType,
  big_reload: customLazy(() => import('./icons/big_reload.svg?react')) as IconExportType,
  bsdeth_circle_color: customLazy(
    () => import('./icons/bsdeth_circle_color.svg?react'),
  ) as IconExportType,
  btc_circle_color: customLazy(
    () => import('./icons/btc_circle_color.svg?react'),
  ) as IconExportType,
  btc_circle_mono: customLazy(() => import('./icons/btc_circle_mono.svg?react')) as IconExportType,
  bug: customLazy(() => import('./icons/bug.svg?react')) as IconExportType,
  cbeth_circle_color: customLazy(
    () => import('./icons/cbeth_circle_color.svg?react'),
  ) as IconExportType,
  cbeth_eth: customLazy(() => import('./icons/cbeth_eth.svg?react')) as IconExportType,
  cbeth_usdc: customLazy(() => import('./icons/cbeth_usdc.svg?react')) as IconExportType,
  cbbtc_circle_color: customLazy(
    () => import('./icons/cbbtc_circle_color.svg?react'),
  ) as IconExportType,
  chai_circle_color: customLazy(
    () => import('./icons/chai_circle_color.svg?react'),
  ) as IconExportType,
  chai_color: customLazy(() => import('./icons/chai_color.svg?react')) as IconExportType,
  chai: customLazy(() => import('./icons/chai.svg?react')) as IconExportType,
  chain_security: customLazy(() => import('./icons/chain_security.svg?react')) as IconExportType,
  chainlink_circle_color: customLazy(
    () => import('./icons/chainlink_circle_color.svg?react'),
  ) as IconExportType,
  chainlink_color: customLazy(() => import('./icons/chainlink_color.svg?react')) as IconExportType,
  chainlink: customLazy(() => import('./icons/chainlink.svg?react')) as IconExportType,
  checkmark_colorful: customLazy(
    () => import('./icons/checkmark_colorful.svg?react'),
  ) as IconExportType,
  checkmark_colorful_beach_club: customLazy(
    () => import('./icons/checkmark_colorful_beach_club.svg?react'),
  ) as IconExportType,
  checkmark_circle: customLazy(
    () => import('./icons/checkmark_circle.svg?react'),
  ) as IconExportType,
  checkmark_colorful_circle: customLazy(
    () => import('./icons/checkmark_colorful_circle.svg?react'),
  ) as IconExportType,
  checkmark_colorful_slim: customLazy(
    () => import('./icons/checkmark_colorful_slim.svg?react'),
  ) as IconExportType,
  checkmark: customLazy(() => import('./icons/checkmark.svg?react')) as IconExportType,
  chevron_down: customLazy(() => import('./icons/chevron_down.svg?react')) as IconExportType,
  chevron_left: customLazy(() => import('./icons/chevron_left.svg?react')) as IconExportType,
  chevron_right: customLazy(() => import('./icons/chevron_right.svg?react')) as IconExportType,
  chevron_up: customLazy(() => import('./icons/chevron_up.svg?react')) as IconExportType,
  clock: customLazy(() => import('./icons/clock.svg?react')) as IconExportType,
  close_colorful: customLazy(() => import('./icons/close_colorful.svg?react')) as IconExportType,
  close_squared: customLazy(() => import('./icons/close_squared.svg?react')) as IconExportType,
  close: customLazy(() => import('./icons/close.svg?react')) as IconExportType,
  cog: customLazy(() => import('./icons/cog.svg?react')) as IconExportType,
  compound_circle_color: customLazy(
    () => import('./icons/compound_circle_color.svg?react'),
  ) as IconExportType,
  compound_color: customLazy(() => import('./icons/compound_color.svg?react')) as IconExportType,
  compound: customLazy(() => import('./icons/compound.svg?react')) as IconExportType,
  constantMultiple: customLazy(() => import('./icons/takeProfit.svg?react')) as IconExportType,
  colorful_hamburger: customLazy(
    () => import('./icons/colorful_hamburger.svg?react'),
  ) as IconExportType,
  colorful_arrow: customLazy(() => import('./icons/colorful_arrow.svg?react')) as IconExportType,
  crv_circle: customLazy(() => import('./icons/crv_circle.svg?react')) as IconExportType,
  crv: customLazy(() => import('./icons/crv.svg?react')) as IconExportType,
  cseth: customLazy(() => import('./icons/cseth.svg?react')) as IconExportType,
  cut: customLazy(() => import('./icons/cut.svg?react')) as IconExportType,
  dai_circle_color: customLazy(
    () => import('./icons/dai_circle_color.svg?react'),
  ) as IconExportType,
  dai_color: customLazy(() => import('./icons/dai_color.svg?react')) as IconExportType,
  dai: customLazy(() => import('./icons/dai.svg?react')) as IconExportType,
  degen: customLazy(() => import('./icons/degen.svg?react')) as IconExportType,
  deposit: customLazy(() => import('./icons/deposit.svg?react')) as IconExportType,
  deth: customLazy(() => import('./icons/deth.svg?react')) as IconExportType,
  digix_circle_color: customLazy(
    () => import('./icons/digix_circle_color.svg?react'),
  ) as IconExportType,
  discord: customLazy(() => import('./icons/discord.svg?react')) as IconExportType,
  down_up: customLazy(() => import('./icons/down_up.svg?react')) as IconExportType,
  dot_arrow_right_colorful: customLazy(
    () => import('./icons/dot_arrow_right_colorful.svg?react'),
  ) as IconExportType,
  earn_network_all: customLazy(
    () => import('./icons/earn_network_all.svg?react'),
  ) as IconExportType,
  earn_network_arbitrum: customLazy(
    () => import('./icons/earn_network_arbitrum.svg?react'),
  ) as IconExportType,
  earn_network_base: customLazy(
    () => import('./icons/earn_network_base.svg?react'),
  ) as IconExportType,
  earn_network_blast: customLazy(
    () => import('./icons/earn_network_blast.svg?react'),
  ) as IconExportType,
  earn_network_ethereum: customLazy(
    () => import('./icons/earn_network_ethereum.svg?react'),
  ) as IconExportType,
  earn_network_optimism: customLazy(
    () => import('./icons/earn_network_optimism.svg?react'),
  ) as IconExportType,
  earn_network_sonic: customLazy(
    () => import('./icons/earn_network_sonic.svg?react'),
  ) as IconExportType,
  earn_institution: customLazy(
    () => import('./icons/earn_institution.svg?react'),
  ) as IconExportType,
  edit: customLazy(() => import('./icons/edit.svg?react')) as IconExportType,
  ena: customLazy(() => import('./icons/ena.svg?react')) as IconExportType,
  eth_circle_color: customLazy(
    () => import('./icons/eth_circle_color.svg?react'),
  ) as IconExportType,
  eth_circle_mono: customLazy(() => import('./icons/eth_circle_mono.svg?react')) as IconExportType,
  eth_usdc: customLazy(() => import('./icons/eth_usdc.svg?react')) as IconExportType,
  ether_circle_color: customLazy(
    () => import('./icons/ether_circle_color.svg?react'),
  ) as IconExportType,
  ether_color: customLazy(() => import('./icons/ether_color.svg?react')) as IconExportType,
  ether: customLazy(() => import('./icons/ether.svg?react')) as IconExportType,
  eurc: customLazy(() => import('./icons/eurc.svg?react')) as IconExportType,
  euler: customLazy(() => import('./icons/euler.svg?react')) as IconExportType,
  euro_circle_color: customLazy(
    () => import('./icons/euro_circle_color.svg?react'),
  ) as IconExportType,
  exchange: customLazy(() => import('./icons/exchange.svg?react')) as IconExportType,
  eye: customLazy(() => import('./icons/eye.svg?react')) as IconExportType,
  ezeth: customLazy(() => import('./icons/ezeth.svg?react')) as IconExportType,
  etherscan: customLazy(() => import('./icons/etherscan.svg?react')) as IconExportType,
  frax_circle_color: customLazy(
    () => import('./icons/frax_circle_color.svg?react'),
  ) as IconExportType,
  gemini_circle_color: customLazy(
    () => import('./icons/gemini_circle_color.svg?react'),
  ) as IconExportType,
  gamepad: customLazy(() => import('./icons/gamepad.svg?react')) as IconExportType,
  gemini_color: customLazy(() => import('./icons/gemini_color.svg?react')) as IconExportType,
  gemini: customLazy(() => import('./icons/gemini.svg?react')) as IconExportType,
  gho_circle_color: customLazy(
    () => import('./icons/gho_circle_color.svg?react'),
  ) as IconExportType,
  gno_circle_color: customLazy(
    () => import('./icons/gno_circle_color.svg?react'),
  ) as IconExportType,
  golem_circle_color: customLazy(
    () => import('./icons/golem_circle_color.svg?react'),
  ) as IconExportType,
  guniv3_dai_usdc1_circles_color: customLazy(
    () => import('./icons/guniv3_dai_usdc1_circles_color.svg?react'),
  ) as IconExportType,
  gusd_circle_color: customLazy(
    () => import('./icons/gusd_circle_color.svg?react'),
  ) as IconExportType,
  gusd_circle_mono: customLazy(
    () => import('./icons/gusd_circle_mono.svg?react'),
  ) as IconExportType,
  info: customLazy(() => import('./icons/info.svg?react')) as IconExportType,
  info_colorful: customLazy(() => import('./icons/info_colorful.svg?react')) as IconExportType,
  knc_circle_color: customLazy(
    () => import('./icons/knc_circle_color.svg?react'),
  ) as IconExportType,
  kyber_circle_color: customLazy(
    () => import('./icons/kyber_circle_color.svg?react'),
  ) as IconExportType,
  kyber_color: customLazy(() => import('./icons/kyber_color.svg?react')) as IconExportType,
  kyber: customLazy(() => import('./icons/kyber.svg?react')) as IconExportType,
  kyc_colorful: customLazy(() => import('./icons/kyc_colorful.svg?react')) as IconExportType,
  latamex: customLazy(() => import('./icons/latamex.svg?react')) as IconExportType,
  landing_page_bridge: customLazy(
    () => import('./icons/landing_page_bridge.svg?react'),
  ) as IconExportType,
  landing_page_buy: customLazy(
    () => import('./icons/landing_page_buy.svg?react'),
  ) as IconExportType,
  landing_page_cashout: customLazy(
    () => import('./icons/landing_page_cashout.svg?react'),
  ) as IconExportType,
  landing_page_send: customLazy(
    () => import('./icons/landing_page_send.svg?react'),
  ) as IconExportType,
  landing_page_swap: customLazy(
    () => import('./icons/landing_page_swap.svg?react'),
  ) as IconExportType,
  layerzero: customLazy(() => import('./icons/layerzero.svg?react')) as IconExportType,
  lbtc: customLazy(() => import('./icons/lbtc.svg?react')) as IconExportType,
  ldo_circle: customLazy(() => import('./icons/ldo_circle.svg?react')) as IconExportType,
  ldo: customLazy(() => import('./icons/ldo.svg?react')) as IconExportType,
  lightning_colorful: customLazy(
    () => import('./icons/lightning_colorful.svg?react'),
  ) as IconExportType,
  link_circle_color: customLazy(
    () => import('./icons/link_circle_color.svg?react'),
  ) as IconExportType,
  link_circle_mono: customLazy(
    () => import('./icons/link_circle_mono.svg?react'),
  ) as IconExportType,
  link: customLazy(() => import('./icons/link.svg?react')) as IconExportType,
  lock: customLazy(() => import('./icons/lock.svg?react')) as IconExportType,
  lock_open_beach_colorful: customLazy(
    () => import('./icons/lock_open_beach_colorful.svg?react'),
  ) as IconExportType,
  lock_open: customLazy(() => import('./icons/lock_open.svg?react')) as IconExportType,
  lock_beach_colorful: customLazy(
    () => import('./icons/lock_beach_colorful.svg?react'),
  ) as IconExportType,
  lrc_circle_color: customLazy(
    () => import('./icons/lrc_circle_color.svg?react'),
  ) as IconExportType,
  lrc_color: customLazy(() => import('./icons/lrc_color.svg?react')) as IconExportType,
  lrc: customLazy(() => import('./icons/lrc.svg?react')) as IconExportType,
  lusd_circle_color: customLazy(
    () => import('./icons/lusd_circle_color.svg?react'),
  ) as IconExportType,
  maker_circle_color: customLazy(
    () => import('./icons/maker_circle_color.svg?react'),
  ) as IconExportType,
  maker_color: customLazy(() => import('./icons/maker_color.svg?react')) as IconExportType,
  maker: customLazy(() => import('./icons/maker.svg?react')) as IconExportType,
  mana_circle_color: customLazy(
    () => import('./icons/mana_circle_color.svg?react'),
  ) as IconExportType,
  mana_circle_mono: customLazy(
    () => import('./icons/mana_circle_mono.svg?react'),
  ) as IconExportType,
  mana_color: customLazy(() => import('./icons/mana_color.svg?react')) as IconExportType,
  mana: customLazy(() => import('./icons/mana.svg?react')) as IconExportType,
  maple: customLazy(() => import('./icons/maple.svg?react')) as IconExportType,
  matic_circle_color: customLazy(
    () => import('./icons/matic_circle_color.svg?react'),
  ) as IconExportType,
  matic_circle_mono: customLazy(
    () => import('./icons/matic_circle_mono.svg?react'),
  ) as IconExportType,
  mbasis: customLazy(() => import('./icons/mbasis.svg?react')) as IconExportType,
  menu: customLazy(() => import('./icons/menu.svg?react')) as IconExportType,
  meveth: customLazy(() => import('./icons/meveth.svg?react')) as IconExportType,
  mkr_circle_color: customLazy(
    () => import('./icons/mkr_circle_color.svg?react'),
  ) as IconExportType,
  moonpay: customLazy(() => import('./icons/moonpay.svg?react')) as IconExportType,
  moonwell: customLazy(() => import('./icons/moonwell.svg?react')) as IconExportType,
  morpho_circle_color: customLazy(
    () => import('./icons/morpho_circle_color.svg?react'),
  ) as IconExportType,
  mpeth: customLazy(() => import('./icons/mpeth.svg?react')) as IconExportType,
  network_arbitrum: customLazy(
    () => import('./icons/network_arbitrum.svg?react'),
  ) as IconExportType,
  network_base: customLazy(() => import('./icons/network_base.svg?react')) as IconExportType,
  network_ethereum: customLazy(
    () => import('./icons/network_ethereum.svg?react'),
  ) as IconExportType,
  network_optimism: customLazy(
    () => import('./icons/network_optimism.svg?react'),
  ) as IconExportType,
  not_supported_icon: customLazy(
    () => import('./icons/not_supported_icon.svg?react'),
  ) as IconExportType,
  omisego_circle_color: customLazy(
    () => import('./icons/omisego_circle_color.svg?react'),
  ) as IconExportType,
  omisego_color: customLazy(() => import('./icons/omisego_color.svg?react')) as IconExportType,
  omisego: customLazy(() => import('./icons/omisego.svg?react')) as IconExportType,
  op_circle: customLazy(() => import('./icons/op_circle.svg?react')) as IconExportType,
  op: customLazy(() => import('./icons/op.svg?react')) as IconExportType,
  open_in_new_tab: customLazy(() => import('./icons/open_in_new_tab.svg?react')) as IconExportType,
  oseth_circle_color: customLazy(
    () => import('./icons/oseth_circle_color.svg?react'),
  ) as IconExportType,
  origin: customLazy(() => import('./icons/origin.svg?react')) as IconExportType,
  partialTakeProfit: customLazy(() => import('./icons/takeProfit.svg?react')) as IconExportType,
  pax_circle_color: customLazy(
    () => import('./icons/pax_circle_color.svg?react'),
  ) as IconExportType,
  pax_color: customLazy(() => import('./icons/pax_color.svg?react')) as IconExportType,
  pax: customLazy(() => import('./icons/pax.svg?react')) as IconExportType,
  pendle: customLazy(() => import('./icons/pendle.svg?react')) as IconExportType,
  person: customLazy(() => import('./icons/person.svg?react')) as IconExportType,
  play: customLazy(() => import('./icons/play.svg?react')) as IconExportType,
  plus: customLazy(() => import('./icons/plus.svg?react')) as IconExportType,
  prime: customLazy(() => import('./icons/prime.svg?react')) as IconExportType,
  pyusd: customLazy(() => import('./icons/pyusd.svg?react')) as IconExportType,
  quant_stamp: customLazy(() => import('./icons/quant_stamp.svg?react')) as IconExportType,
  question_mark: customLazy(() => import('./icons/question_mark.svg?react')) as IconExportType,
  question_o: customLazy(() => import('./icons/question_o.svg?react')) as IconExportType,
  question: customLazy(() => import('./icons/question.svg?react')) as IconExportType,
  radio_button_checked: customLazy(
    () => import('./icons/radio_button_checked.svg?react'),
  ) as IconExportType,
  radio_button: customLazy(() => import('./icons/radio_button.svg?react')) as IconExportType,
  rays: customLazy(() => import('./icons/rays.svg?react')) as IconExportType,
  rbn_circle_color: customLazy(
    () => import('./icons/rbn_circle_color.svg?react'),
  ) as IconExportType,
  rebalancing: customLazy(() => import('./icons/rebalancing.svg?react')) as IconExportType,
  refresh: customLazy(() => import('./icons/refresh.svg?react')) as IconExportType,
  renbtc_circle_color: customLazy(
    () => import('./icons/renbtc_circle_color.svg?react'),
  ) as IconExportType,
  reth_circle_color: customLazy(
    () => import('./icons/reth_circle_color.svg?react'),
  ) as IconExportType,
  reth_eth: customLazy(() => import('./icons/reth_eth.svg?react')) as IconExportType,
  reth_usdc: customLazy(() => import('./icons/reth_usdc.svg?react')) as IconExportType,
  rpl_circle: customLazy(() => import('./icons/rpl_circle.svg?react')) as IconExportType,
  rpl: customLazy(() => import('./icons/rpl.svg?react')) as IconExportType,
  rseth: customLazy(() => import('./icons/rseth.svg?react')) as IconExportType,
  rsweth: customLazy(() => import('./icons/rsweth.svg?react')) as IconExportType,
  safe: customLazy(() => import('./icons/safe.svg?react')) as IconExportType,
  sai_circle_color: customLazy(
    () => import('./icons/sai_circle_color.svg?react'),
  ) as IconExportType,
  sai_color: customLazy(() => import('./icons/sai_color.svg?react')) as IconExportType,
  sai: customLazy(() => import('./icons/sai.svg?react')) as IconExportType,
  sdai_circle_color: customLazy(
    () => import('./icons/sdai_circle_color.svg?react'),
  ) as IconExportType,
  search_icon: customLazy(() => import('./icons/search_icon.svg?react')) as IconExportType,
  send: customLazy(() => import('./icons/send.svg?react')) as IconExportType,
  share: customLazy(() => import('./icons/share_v2.svg?react')) as IconExportType,
  sign_out: customLazy(() => import('./icons/sign_out.svg?react')) as IconExportType,
  silo: customLazy(() => import('./icons/silo.svg?react')) as IconExportType,
  sky: customLazy(() => import('./icons/sky.svg?react')) as IconExportType,
  snx: customLazy(() => import('./icons/snx.svg?react')) as IconExportType,
  social_link: customLazy(() => import('./icons/social_link.svg?react')) as IconExportType,
  social_x: customLazy(() => import('./icons/social_x.svg?react')) as IconExportType,
  social_x_beach_club: customLazy(
    () => import('./icons/social_x_beach_club.svg?react'),
  ) as IconExportType,
  social_link_beach_club: customLazy(
    () => import('./icons/social_link_beach_club.svg?react'),
  ) as IconExportType,
  social_question_beach_club: customLazy(
    () => import('./icons/social_question_beach_club.svg?react'),
  ) as IconExportType,
  social_plant_beach_club: customLazy(
    () => import('./icons/social_plant_beach_club.svg?react'),
  ) as IconExportType,
  sonic_badge_mainnet: customLazy(
    () => import('./icons/sonic_badge_mainnet.svg?react'),
  ) as IconExportType,
  spark_circle_color: customLazy(
    () => import('./icons/spark_circle_color.svg?react'),
  ) as IconExportType,
  stars: customLazy(() => import('./icons/stars.svg?react')) as IconExportType,
  stars_colorful: customLazy(() => import('./icons/stars_colorful.svg?react')) as IconExportType,
  star_solid_beach_club: customLazy(
    () => import('./icons/star_solid_beach_club.svg?react'),
  ) as IconExportType,
  steth_circle_color: customLazy(
    () => import('./icons/steth_circle_color.svg?react'),
  ) as IconExportType,
  steth_eth: customLazy(() => import('./icons/steth_eth.svg?react')) as IconExportType,
  steth_usdc: customLazy(() => import('./icons/steth_usdc.svg?react')) as IconExportType,
  stopLoss: customLazy(() => import('./icons/stopLoss.svg?react')) as IconExportType,
  styeth_circle_color: customLazy(
    () => import('./icons/styeth_circle_color.svg?react'),
  ) as IconExportType,
  sumr: customLazy(() => import('./icons/sumr.svg?react')) as IconExportType,
  summer_light: customLazy(() => import('./icons/summer_light.svg?react')) as IconExportType,
  summer_illustration_check: customLazy(
    () => import('./icons/summer_illustration_check.svg?react'),
  ) as IconExportType,
  summer_illustration_email: customLazy(
    () => import('./icons/summer_illustration_email.svg?react'),
  ) as IconExportType,
  summer_illustration_failed: customLazy(
    () => import('./icons/summer_illustration_failed.svg?react'),
  ) as IconExportType,
  summer_illustration_gas_fee: customLazy(
    () => import('./icons/summer_illustration_gas_fee.svg?react'),
  ) as IconExportType,
  summer_illustration_identity: customLazy(
    () => import('./icons/summer_illustration_identity.svg?react'),
  ) as IconExportType,
  summer_illustration_logo: customLazy(
    () => import('./icons/summer_illustration_logo.svg?react'),
  ) as IconExportType,
  summer_illustration_passkey: customLazy(
    () => import('./icons/summer_illustration_passkey.svg?react'),
  ) as IconExportType,
  summer_illustration_shield: customLazy(
    () => import('./icons/summer_illustration_shield.svg?react'),
  ) as IconExportType,
  summer_illustration_switch: customLazy(
    () => import('./icons/summer_illustration_switch.svg?react'),
  ) as IconExportType,
  summer_illustration_transak_logo: customLazy(
    () => import('./icons/summer_illustration_transak_logo.svg?react'),
  ) as IconExportType,
  summer_illustration_verification: customLazy(
    () => import('./icons/summer_illustration_verification.svg?react'),
  ) as IconExportType,
  susd_circle: customLazy(() => import('./icons/susd_circle.svg?react')) as IconExportType,
  susd: customLazy(() => import('./icons/susd.svg?react')) as IconExportType,
  susde: customLazy(() => import('./icons/susde.svg?react')) as IconExportType,
  susds: customLazy(() => import('./icons/susds.svg?react')) as IconExportType,
  swbtc: customLazy(() => import('./icons/swbtc.svg?react')) as IconExportType,
  syrupusdc: customLazy(() => import('./icons/syrupusdc.svg?react')) as IconExportType,
  takeProfit: customLazy(() => import('./icons/takeProfit.svg?react')) as IconExportType,
  tbtc_circle_color: customLazy(
    () => import('./icons/tbtc_circle_color.svg?react'),
  ) as IconExportType,
  term: customLazy(() => import('./icons/term.svg?react')) as IconExportType,
  team_linkedin: customLazy(() => import('./icons/team_linkedin.svg?react')) as IconExportType,
  team_x: customLazy(() => import('./icons/team_x.svg?react')) as IconExportType,
  tooltip: customLazy(() => import('./icons/tooltip.svg?react')) as IconExportType,
  trail_of_bits: customLazy(() => import('./icons/trail_of_bits.svg?react')) as IconExportType,
  trailingStopLoss: customLazy(() => import('./icons/stopLoss.svg?react')) as IconExportType,
  trash: customLazy(() => import('./icons/trash.svg?react')) as IconExportType,
  tusd_circle_color: customLazy(
    () => import('./icons/tusd_circle_color.svg?react'),
  ) as IconExportType,
  tusd_color: customLazy(() => import('./icons/tusd_color.svg?react')) as IconExportType,
  tusd: customLazy(() => import('./icons/tusd.svg?react')) as IconExportType,
  uni_circle_color: customLazy(
    () => import('./icons/uni_circle_color.svg?react'),
  ) as IconExportType,
  uni_circle_mono: customLazy(() => import('./icons/uni_circle_mono.svg?react')) as IconExportType,
  uni_lp_circle_color: customLazy(
    () => import('./icons/uni_lp_circle_color.svg?react'),
  ) as IconExportType,
  uni_lp_circle_mono: customLazy(
    () => import('./icons/uni_lp_circle_mono.svg?react'),
  ) as IconExportType,
  unieth: customLazy(() => import('./icons/unieth.svg?react')) as IconExportType,
  univ2_dai_usdc_circles_color: customLazy(
    () => import('./icons/univ2_dai_usdc_circles_color.svg?react'),
  ) as IconExportType,
  univ2_dai_usdt_circles_color: customLazy(
    () => import('./icons/univ2_dai_usdt_circles_color.svg?react'),
  ) as IconExportType,
  univ2_eth_usdt_circles_color: customLazy(
    () => import('./icons/univ2_eth_usdt_circles_color.svg?react'),
  ) as IconExportType,
  univ2_usdc_eth_circles_color: customLazy(
    () => import('./icons/univ2_usdc_eth_circles_color.svg?react'),
  ) as IconExportType,
  usd_circle: customLazy(() => import('./icons/usd_circle.svg?react')) as IconExportType,
  usd_circle_color: customLazy(
    () => import('./icons/usd_circle_color.svg?react'),
  ) as IconExportType,
  usda: customLazy(() => import('./icons/usda.svg?react')) as IconExportType,
  usdc_circle_color: customLazy(
    () => import('./icons/usdc_circle_color.svg?react'),
  ) as IconExportType,
  usdc: customLazy(() => import('./icons/usdc.svg?react')) as IconExportType,
  usde: customLazy(() => import('./icons/usde.svg?react')) as IconExportType,
  usdp_circle_color: customLazy(
    () => import('./icons/usdp_circle_color.svg?react'),
  ) as IconExportType,
  usds: customLazy(() => import('./icons/usds.svg?react')) as IconExportType,
  usdt_circle_color: customLazy(
    () => import('./icons/usdt_circle_color.svg?react'),
  ) as IconExportType,
  usdt_color: customLazy(() => import('./icons/usdt_color.svg?react')) as IconExportType,
  usdt: customLazy(() => import('./icons/usdt.svg?react')) as IconExportType,
  'usd₮0_circle_color': customLazy(
    () => import('./icons/usd₮0_circle_color.svg?react'),
  ) as IconExportType,
  usd0: customLazy(() => import('./icons/usd0.svg?react')) as IconExportType,
  'usd0++': customLazy(() => import('./icons/usd0++.svg?react')) as IconExportType,
  user: customLazy(() => import('./icons/user.svg?react')) as IconExportType,
  users_beach_club: customLazy(
    () => import('./icons/users_beach_club.svg?react'),
  ) as IconExportType,
  vault_network_warning: customLazy(
    () => import('./icons/vault_network_warning.svg?react'),
  ) as IconExportType,
  wallet: customLazy(() => import('./icons/wallet.svg?react')) as IconExportType,
  wbtc_circle_color: customLazy(
    () => import('./icons/wbtc_circle_color.svg?react'),
  ) as IconExportType,
  wbtc_color: customLazy(() => import('./icons/wbtc_color.svg?react')) as IconExportType,
  wbtc_usdc: customLazy(() => import('./icons/wbtc_usdc.svg?react')) as IconExportType,
  wbtc: customLazy(() => import('./icons/wbtc.svg?react')) as IconExportType,
  weeth_circle_color: customLazy(
    () => import('./icons/weeth_circle_color.svg?react'),
  ) as IconExportType,
  weth_circle_color: customLazy(
    () => import('./icons/weth_circle_color.svg?react'),
  ) as IconExportType,
  withdraw: customLazy(() => import('./icons/withdraw.svg?react')) as IconExportType,
  wld_circle_color: customLazy(
    () => import('./icons/wld_circle_color.svg?react'),
  ) as IconExportType,
  woeth: customLazy(() => import('./icons/woeth.svg?react')) as IconExportType,
  wsteth_circle_color: customLazy(
    () => import('./icons/wsteth_circle_color.svg?react'),
  ) as IconExportType,
  wsuperoethb: customLazy(() => import('./icons/wsuperoethb.svg?react')) as IconExportType,
  wyre: customLazy(() => import('./icons/wyre.svg?react')) as IconExportType,
  xeth: customLazy(() => import('./icons/xeth.svg?react')) as IconExportType,
  yen_circle_color: customLazy(
    () => import('./icons/yen_circle_color.svg?react'),
  ) as IconExportType,
  yfi_circle_color: customLazy(
    () => import('./icons/yfi_circle_color.svg?react'),
  ) as IconExportType,
  yfi_circle_mono: customLazy(() => import('./icons/yfi_circle_mono.svg?react')) as IconExportType,
  yieldbtc_circle_color: customLazy(
    () => import('./icons/yieldbtc_circle_color.svg?react'),
  ) as IconExportType,
  yieldeth_circle_color: customLazy(
    () => import('./icons/yieldeth_circle_color.svg?react'),
  ) as IconExportType,
  zerox_circle_color: customLazy(
    () => import('./icons/zerox_circle_color.svg?react'),
  ) as IconExportType,
  zerox_color: customLazy(() => import('./icons/zerox_color.svg?react')) as IconExportType,
  zerox: customLazy(() => import('./icons/zerox.svg?react')) as IconExportType,
  wusdl: customLazy(() => import('./icons/wusdl.svg?react')) as IconExportType,
  plant_colorful: customLazy(() => import('./icons/plant_colorful.svg?react')) as IconExportType,
  checkmark_cookie_colorful: customLazy(
    () => import('./icons/checkmark_cookie_colorful.svg?react'),
  ) as IconExportType,
  migrate_colorful: customLazy(
    () => import('./icons/migrate_colorful.svg?react'),
  ) as IconExportType,
  referer_colorful: customLazy(
    () => import('./icons/referer_colorful.svg?react'),
  ) as IconExportType,
  x_colorful: customLazy(() => import('./icons/x_colorful.svg?react')) as IconExportType,
  stack_colorful: customLazy(() => import('./icons/stack_colorful.svg?react')) as IconExportType,
  fluid: customLazy(() => import('./icons/fluid.svg?react')) as IconExportType,
  gearbox: customLazy(() => import('./icons/gearbox.svg?react')) as IconExportType,
  linkedin: customLazy(() => import('./icons/linkedin.svg?react')) as IconExportType,
  x: customLazy(() => import('./icons/x.svg?react')) as IconExportType,
  warning: customLazy(() => import('./icons/warning.svg?react')) as IconExportType,
  scroller_aave: customLazy(() => import('./icons/scroller_aave.svg?react')) as IconExportType,
  scroller_sky: customLazy(() => import('./icons/scroller_sky.svg?react')) as IconExportType,
  scroller_spark: customLazy(() => import('./icons/scroller_spark.svg?react')) as IconExportType,
  scroller_pendle: customLazy(() => import('./icons/scroller_pendle.svg?react')) as IconExportType,
  scroller_gearbox: customLazy(
    () => import('./icons/scroller_gearbox.svg?react'),
  ) as IconExportType,
  scroller_euler: customLazy(() => import('./icons/scroller_euler.svg?react')) as IconExportType,
  scroller_compound: customLazy(
    () => import('./icons/scroller_compound.svg?react'),
  ) as IconExportType,
  scroller_ethena: customLazy(() => import('./icons/scroller_ethena.svg?react')) as IconExportType,
  scroller_fluid: customLazy(() => import('./icons/scroller_fluid.svg?react')) as IconExportType,
  earn_1_on_1: customLazy(() => import('./icons/earn_1_on_1.svg?react')) as IconExportType,
  earn_discord: customLazy(() => import('./icons/earn_discord.svg?react')) as IconExportType,
  earn_email: customLazy(() => import('./icons/earn_email.svg?react')) as IconExportType,
  earn_rebalance_activities: customLazy(
    () => import('./icons/earn_rebalance_activities.svg?react'),
  ) as IconExportType,
  earn_user_activities: customLazy(
    () => import('./icons/earn_user_activities.svg?react'),
  ) as IconExportType,
  earn_yield_trend: customLazy(
    () => import('./icons/earn_yield_trend.svg?react'),
  ) as IconExportType,

  // imported from tabler icon database

  brand_icon_discord: customLazy(() => import('./icons/brand-discord.svg?react')) as IconExportType,
  brand_icon_github: customLazy(() => import('./icons/brand-github.svg?react')) as IconExportType,
  brand_icon_twitter: customLazy(() => import('./icons/brand-twitter.svg?react')) as IconExportType,
  tabler_x: customLazy(() => import('./icons/tabler-x.svg?react')) as IconExportType,
  tools_kitchen_off: customLazy(
    () => import('./icons/tools-kitchen-off.svg?react'),
  ) as IconExportType,
  tools_kitchen: customLazy(() => import('./icons/tools-kitchen.svg?react')) as IconExportType,
  device_floppy: customLazy(() => import('./icons/device-floppy.svg?react')) as IconExportType,
  trophy: customLazy(() => import('./icons/trophy.svg?react')) as IconExportType,
}
