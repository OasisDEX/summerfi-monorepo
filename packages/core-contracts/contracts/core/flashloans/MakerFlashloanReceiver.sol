// SPDX-License-Identifier: AGPL-3.0-or-later
//
// MakerFlashloanReceiver.sol
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
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {AddressBookUser} from '../AddressBook/AddressBookUser.sol';
import {FlashloanProcessor} from './FlashloanProcessor.sol';
import {FlashloanData} from '../types/Common.sol';

/**
 * @title MakerFlashloanReceiver
 * @notice Handler for receiving flashloans from Maker
 */
abstract contract MakerFlashloanReceiver is AddressBookUser, FlashloanProcessor {
  using SafeERC20 for IERC20;

  /// CONSTANTS
  string constant FLASH_MINT_MODULE = 'McdFlashMintModule';

  /// CONSTRUCTO

  /**
   * @notice Not to be called directly.
   * @dev Callback handler for use by a flashloan lender contract.
   * If the isProxyFlashloan flag is supplied we reestablish the calling context as the user's proxy (at time of writing DSProxy). Although stored values will
   * We set the initiator on Operation Storage such that calls originating from other contracts EG Oasis Automation Bot (see https://github.com/OasisDEX/automation-smartcontracts)
   * The initiator address will be used to store values against the original msg.sender.
   * This protects against the Operation Storage values being polluted by malicious code from untrusted 3rd party contracts.

   * @param asset The address of the asset being flash loaned
   * @param amount The size of the flash loan
   * @param fee The Fee charged for the loan
   * @param data Any calldata sent to the contract for execution later in the callback
   */
  function onFlashLoan(
    address initiator,
    address asset,
    uint256 amount,
    uint256 fee,
    bytes calldata data
  ) external onlyExternalService(FLASH_MINT_MODULE) returns (bytes32) {
    FlashloanData memory flashloanData = abi.decode(data, (FlashloanData));
    uint256 paybackAmount = amount + fee;

    _processFlashloan(flashloanData, initiator, IERC20(asset), paybackAmount);

    IERC20(asset).forceApprove(_msgSender(), paybackAmount);

    return keccak256('ERC3156FlashBorrower.onFlashLoan');
  }
}
