// SPDX-License-Identifier: AGPL-3.0-or-later
//
// AddressBookUser.sol
//
// Copyright (C) 2024 Oazo Apps Limited
//
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

import {Context} from '@openzeppelin/contracts/utils/Context.sol';
import {IAddressBook} from './IAddressBook.sol';

/**
 * @title AddressBookUser
 * @notice Handles the reference to the AddressBook contract and
 *         provides a utility function to retrieve addresses of registered services
 */
contract AddressBookUser is Context {
  /// ERRORS
  error ExternalServiceNotRegistered(string serviceName);

  /// STORAGE
  /** Reference to the AddressBook contract */
  IAddressBook public immutable addressBook;

  /// CONSTRUCTOR
  constructor(IAddressBook _addressBook) {
    addressBook = _addressBook;
  }

  /// MODIFIERS

  /**
   * Checks if the sender is the address of an external service
   *
   * @param serviceName The name of the external service to check
   */
  modifier onlyExternalService(string memory serviceName) {
    if (_msgSender() != addressBook.getExternalService(serviceName)) {
      revert ExternalServiceNotRegistered(serviceName);
    }
    _;
  }

  /// FUNCTIONS
  /** See IAddressBook.getExternalService */
  function _getExternalService(string calldata serviceName) internal view returns (address) {
    return addressBook.getExternalService(serviceName);
  }

  /** See IAddressBook.getAction */
  function _getAction(string calldata actionName) internal view returns (address) {
    return addressBook.getAction(actionName);
  }

  /** See IAddressBook.getExternalServiceByHash */
  function _getExternalServiceByHash(bytes32 serviceNameHash) internal view returns (address) {
    return addressBook.getExternalServiceByHash(serviceNameHash);
  }

  /** See IAddressBook.getActionByHash */
  function _getActionByHash(bytes32 actionNameHash) internal view returns (address) {
    return addressBook.getActionByHash(actionNameHash);
  }
}
