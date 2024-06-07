// SPDX-License-Identifier: AGPL-3.0-or-later
//
// BalancerFlashloanReceiver.sol
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
import {AddressBookUser} from '../AddressBook/AddressBookUser.sol';
import {FlashloanProcessor} from './FlashloanProcessor.sol';
import {FlashloanData} from '../types/Common.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

/**
 * @title BalancerFlashloanReceiver
 * @notice Handler for receiving flashloans from Balancer
 */
abstract contract BalancerFlashloanReceiver is AddressBookUser, FlashloanProcessor {
  using SafeERC20 for IERC20;

  /// CONSTANTS
  string constant BALANCER_VAULT = 'BalancerVault';

  /**
   * Receives the flashloan from Balancer and validates the parameters
   *
   * @param tokens The addresses of the tokens that were flashloaned
   * @param amounts The amounts of the tokens that were flashloaned
   * @param feeAmounts The fees that must be paid back for each of the tokens that were flashloaned
   * @param data The data that was passed in the flashloan call
   *
   * @dev When `flashLoan` is called on the Vault, it invokes the `receiveFlashLoan` hook on the recipient.
   *
   * At the time of the call, the Vault will have transferred `amounts` for `tokens` to the recipient. Before this
   * call returns, the recipient must have transferred `amounts` plus `feeAmounts` for each token back to the
   * Vault, or else the entire flash loan will revert.
   *
   * `userData` is the same value passed in the `IVault.flashLoan` call.
   */
  function receiveFlashLoan(
    IERC20[] memory tokens,
    uint256[] memory amounts,
    uint256[] memory feeAmounts,
    bytes memory data
  ) external onlyExternalService(BALANCER_VAULT) {
    (FlashloanData memory flashloanData, address initiator) = abi.decode(
      data,
      (FlashloanData, address)
    );

    IERC20 receivedToken = tokens[0];
    uint256 paybackAmount = amounts[0] + feeAmounts[0];

    _processFlashloan(flashloanData, initiator, receivedToken, paybackAmount);

    IERC20(receivedToken).safeTransfer(_msgSender(), paybackAmount);
  }
}
