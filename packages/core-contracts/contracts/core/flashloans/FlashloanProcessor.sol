// SPDX-License-Identifier: AGPL-3.0-or-later
//
// FlashloanProcessor.sol
//
// Copyright (C) 2024 Oazo Apps Limited
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
pragma solidity 0.8.25;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {FlashloanData} from '../types/Common.sol';

/**
 * @title FlashloanProcessor
 * @notice Interface for the processor of a Flashloan
 *
 * This allows to standardize the way flashloans are processed in the contracts by having a common interface
 * and narrowing down the different flashloan providers interfaces to this one
 */
abstract contract FlashloanProcessor {
  /// ERRORS
  error WrongFlashloanedAsset(address received, address required);
  error WrongFlashloanedAmount(uint256 received, uint256 required);
  error NotEnoughBalanceForPayback(address token, uint256 paybackAmount, uint256 currentBalance);

  /// INTERNAL FUNCTIONS

  /**
   * Processes the flashloan
   *
   * @param flashloanData The standardize data for the flashloan
   * @param flashloanInitiator The address that initiated the flashloan (typically an AccountImplementation contract)
   * @param paybackAmount The amount to payback the flashloan
   *
   * @dev This is a wrapper for the _flashloanHandler function where the parameters are
   *      checked and the payback balance is validated at the end
   */
  function _processFlashloan(
    FlashloanData memory flashloanData,
    address flashloanInitiator,
    IERC20 receivedToken,
    uint256 paybackAmount
  ) internal {
    _validateFlashloanData(flashloanData, receivedToken);

    _flashloanHandler(flashloanData, flashloanInitiator, paybackAmount);

    _validateEnoughBalanceForPayback(receivedToken, paybackAmount);
  }

  /// PRIVATE FUNCTIONS

  /**
   * Validates the flashloan data received from the flashloan provider
   * @param flashloanData The standardize data for the flashloan
   *
   * This validator checks that the received tokens and their amounts are what is expected
   */
  function _validateFlashloanData(
    FlashloanData memory flashloanData,
    IERC20 receivedToken
  ) private view {
    if (flashloanData.asset != address(receivedToken)) {
      revert WrongFlashloanedAsset(address(receivedToken), flashloanData.asset);
    }

    uint256 assetBalance = receivedToken.balanceOf(address(this));

    if (assetBalance < flashloanData.amount) {
      revert WrongFlashloanedAmount(assetBalance, flashloanData.amount);
    }
  }

  /**
   * Validates that the contract has enough balance to payback the flashloan
   *
   * @param token The token to payback the flashloan
   * @param paybackAmount The amount to payback the flashloan
   */
  function _validateEnoughBalanceForPayback(IERC20 token, uint256 paybackAmount) private view {
    uint256 currentBalance = token.balanceOf(address(this));

    if (currentBalance < paybackAmount) {
      revert NotEnoughBalanceForPayback(address(token), paybackAmount, currentBalance);
    }
  }

  /// VIRTUAL FUNCTIONS

  /**
   * Callback for the flashloan where the user can implement the logic to handle the flashloan
   *
   * @param flashloanData The standardize data for the flashloan
   * @param flashloanSender The address that initiated the flashloan
   * @param paybackAmount The amount to payback the flashloan
   *
   * @dev This function should be implemented by the contract that inherits from this one
   */
  function _flashloanHandler(
    FlashloanData memory flashloanData,
    address flashloanSender,
    uint256 paybackAmount
  ) internal virtual;
}
