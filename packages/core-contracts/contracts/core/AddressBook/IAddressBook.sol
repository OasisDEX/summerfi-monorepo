// SPDX-License-Identifier: AGPL-3.0-or-later
//
// IAddressBook.sol
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

/**
 * @title IAddressBook
 * @notice Offers a way to register and retrieve services by name or hashed name
 *
 * It differentiates between 2 types of services:
 *   - External services
 *   - Actions
 *
 * External services are services that are not part of the system and are not controlled by Summer
 * Actions are services that are part of the system and are controlled by Summer
 *
 * In particular this difference is used to only delegate calls to actions and not to external services
 * as this opens the door to potential attacks (like self-destruct)
 */
interface IAddressBook {
  /** EVENTS */
  event ExternalServiceAdded(
    bytes32 indexed serviceNamehash,
    string serviceName,
    address serviceAddress
  );
  event ActionAdded(bytes32 indexed actionNameHash, string actionName, address actionAddress);

  /** ERRORS */
  error ExternalServiceAlreadyExists(
    bytes32 serviceNamehash,
    string serviceName,
    address registeredServiceAddress
  );
  error ActionAlreadyExists(bytes32 actionNameHash, string actionName, address actionAddress);

  /**
   * Adds a new external service to the registry
   *
   * @param serviceName The name of the service to add
   * @param serviceAddress The address of the service to add
   */
  function addExternalService(string calldata serviceName, address serviceAddress) external;

  /**
   * Adds a new action to the registry
   *
   * @param actionName The name of the action name to add
   * @param actionAddress The address of the action to add
   */
  function addAction(string calldata actionName, address actionAddress) external;

  /**
   * Retrieves the address of a registered service
   *
   * @param serviceName The name of the service to retrieve
   */
  function getExternalService(string calldata serviceName) external view returns (address);

  /**
   * Retrieves the address of a registered action
   *
   * @param actionName The name of the action to retrieve
   */
  function getAction(string calldata actionName) external view returns (address);

  /**
   * Retrieves the address of an external service by hash
   *
   * @param serviceHash The hash of the service name to retrieve
   */

  function getExternalServiceByHash(bytes32 serviceHash) external view returns (address);

  /**
   * Retrieves the address of an action by name
   *
   * @param actionHash The hash of the action name to retrieve
   */
  function getActionByHash(bytes32 actionHash) external view returns (address);

  /**
   * Hashes the given name and returns the hash
   *
   * @param name  The name to hash
   */
  function calculateNameHash(string calldata name) external pure returns (bytes32);
}
