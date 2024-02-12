// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.15;

import { FakeERC20 } from "./FakeERC20.sol";

/**
    @title FakeDAI

    @notice Fake DAI token
 */
contract FakeWSTETH is FakeERC20 {
  // solhint-disable-next-line no-empty-blocks
  constructor() FakeERC20("WSTETH", "WSTETH", 18) {}
}
