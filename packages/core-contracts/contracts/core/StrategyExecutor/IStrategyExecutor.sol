// SPDX-License-Identifier: AGPL-3.0-or-later
//
// IStrategyExecutor.sol
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

import {Call} from '../types/Common.sol';

/**
 * @title IStrategyExecutor
 * @notice Executes strategies consisting of a sequence of Actions
 */
interface IStrategyExecutor {
  /// EVENTS
  event StrategyExecuted(address indexed initiator, string strategyName, Call[] strategyActions);

  // ERRORS
  error InvalidActionHash(bytes32 actionHash);

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
  ) external payable;

  /**
   * @notice Executes the calls of an strategy
   * @param calls An array of Action calls to be executed
   *
   * @dev Can only be called by the StrategyExecutor itself. The only use is for the StrategyExecutor to call itself
   *      on a flashloan callback so it can continue executing the actions of the strategy
   */
  function executeStrategyCalls(Call[] memory calls) external;
}
