// SPDX-License-Identifier: AGPL-3.0-or-later
//
// StrategyExecutor.sol
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

import {Address} from '@openzeppelin/contracts/utils/Address.sol';

import {IStrategyExecutor} from './IStrategyExecutor.sol';
import {AccountImplementationFlashloanRedirector} from '../flashloans/AccountImplementationFlashloanRedirector.sol';
import {IAddressBook} from '../AddressBook/IAddressBook.sol';
import {Call} from '../types/Common.sol';

/**
 * @custom:see IStrategyExecutor
 *
 * @dev AddressBookUser is inherited from the flashloan receivers
 */
contract StrategyExecutor is AccountImplementationFlashloanRedirector, IStrategyExecutor {
  using Address for address;

  /// CONSTANTS
  string constant STRATEGY_EXECUTOR = 'StrategyExecutor';

  /// CONSTRUCTOR
  constructor(IAddressBook _addressBook) AccountImplementationFlashloanRedirector(_addressBook) {
    // Empty on purpose
  }

  /**
   * @notice Executes a strategy
   * 
   * @param strategyName The name of the Operation being executed
   * @param strategyActions An array of Action calls the operation must execute
   
   * @dev
   * There are operations stored in the OperationsRegistry which guarantee the order of execution of actions for a given Operation.
   * There is a possibility to execute an arrays of calls that don't form an official operation.
   *
   * Operation storage is cleared before and after an operation is executed.
   *
   * To avoid re-entrancy attack, there is a lock implemented on OpStorage.
   * A standard reentrancy modifier is not sufficient because the second call via the onFlashloan handler
   * calls aggregateCallback via DSProxy once again but this breaks the special modifier _ behaviour
   * and the modifier cannot return the execution flow to the original function.
   * This is why re-entrancy defence is immplemented here using an external storage contract via the lock/unlock functions   
   */
  function executeStrategy(
    string calldata strategyName,
    Call[] memory strategyActions
  ) external payable {
    _executeStrategyCalls(strategyActions);

    emit StrategyExecuted(_msgSender(), strategyName, strategyActions);
  }

  /**
   * @notice Executes the calls of an strategy
   * @param calls An array of Action calls to be executed
   *
   * @dev Can only be called by the StrategyExecutor itself. The only use is for the StrategyExecutor to call itself
   *      on a flashloan callback so it can continue executing the actions of the strategy
   */
  function executeStrategyCalls(
    Call[] memory calls
  ) external onlyExternalService(STRATEGY_EXECUTOR) {
    _executeStrategyCalls(calls);
  }

  /// PRIVATE FUNCTIONS

  /**
   * @notice Executes the calls of an strategy
   * @param calls An array of Action calls to be executed
   */
  function _executeStrategyCalls(Call[] memory calls) private {
    for (uint256 current = 0; current < calls.length; current++) {
      Call memory call = calls[current];

      address actionAddress = _getActionByHash(call.targetHash);

      if (actionAddress == address(0)) {
        revert InvalidActionHash(call.targetHash);
      }

      actionAddress.functionDelegateCall(call.callData);
    }
  }
}
