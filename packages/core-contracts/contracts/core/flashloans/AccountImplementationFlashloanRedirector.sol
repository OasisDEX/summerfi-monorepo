// SPDX-License-Identifier: AGPL-3.0-or-later
//
// AccountImplementationFlashloanRedirector.sol
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

import {IAccountImplementation} from '../dpm/IAccountImplementation.sol';
import {BalancerFlashloanReceiver} from '../flashloans/BalancerFlashloanReceiver.sol';
import {MakerFlashloanReceiver} from '../flashloans/MakerFlashloanReceiver.sol';
import {FlashloanData} from '../types/Common.sol';
import {IStrategyExecutor} from '../StrategyExecutor/IStrategyExecutor.sol';
import {AddressBookUser} from '../AddressBook/AddressBookUser.sol';
import {IAddressBook} from '../AddressBook/IAddressBook.sol';

/**
 * @title AccountImplementationFlashloanRedirector
 * @notice Redirects the flashloan calls to the AccountImplementation contract that initiated the
 *         flashoan in the first place
 *
 * This is done by calling the `execute` function of the AccountImplementation contract with the
 * address of the current context (typically the StrategyExecutor) and the encoded calls to execute
 */
contract AccountImplementationFlashloanRedirector is
  AddressBookUser,
  BalancerFlashloanReceiver,
  MakerFlashloanReceiver
{
  using SafeERC20 for IERC20;

  /// CONSTRUCTOR
  constructor(IAddressBook _addressBook) AddressBookUser(_addressBook) {
    // Empty on purpose
  }

  /** @custom:see FlashloanProcessor._flashloanHandler */
  function _flashloanHandler(
    FlashloanData memory flashloanData,
    address flashloanInitiator,
    uint256 /* paybackAmount */
  ) internal override {
    IERC20(flashloanData.asset).safeTransfer(flashloanInitiator, flashloanData.amount);

    IAccountImplementation(payable(flashloanInitiator)).execute(
      address(this),
      abi.encodeWithSelector(IStrategyExecutor.executeStrategyCalls.selector, flashloanData.calls)
    );
  }
}
