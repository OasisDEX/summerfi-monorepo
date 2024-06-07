// SPDX-License-Identifier: AGPL-3.0-or-later
//
// AddressBook.sol
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
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {IAddressBook} from './IAddressBook.sol';

/**
 * @title AddressBook
 */
contract AddressBook is Context, Ownable, IAddressBook {
  /// STORAGE

  /** Service Name Hash -> Service Address */
  mapping(bytes32 => address) private _externalServices;
  /** Action Name Hash -> Action Address */
  mapping(bytes32 => address) private _actions;

  /// CONSTRUCTOR
  constructor(uint256 initialDelay) Ownable(_msgSender()) {
    // Empty on purpose
  }

  /** @custom:see IAddressBook.addExternalService */
  function addExternalService(
    string calldata serviceName,
    address serviceAddress
  ) external onlyOwner {
    bytes32 serviceNameHash = _calculateNameHash(serviceName);

    if (_externalServices[serviceNameHash] != address(0)) {
      revert ExternalServiceAlreadyExists(
        serviceNameHash,
        serviceName,
        _externalServices[serviceNameHash]
      );
    }

    _externalServices[serviceNameHash] = serviceAddress;

    emit ExternalServiceAdded(serviceNameHash, serviceName, serviceAddress);
  }

  /** @custom:see IAddressBook.addAction */
  function addAction(string calldata actionName, address actionAddress) external onlyOwner {
    bytes32 actionNameHash = _calculateNameHash(actionName);

    if (_actions[actionNameHash] != address(0)) {
      revert ExternalServiceAlreadyExists(actionNameHash, actionName, _actions[actionNameHash]);
    }

    _actions[actionNameHash] = actionAddress;

    emit ActionAdded(actionNameHash, actionName, actionAddress);
  }

  /** @custom:see IAddressBook.getExternalService */
  function getExternalService(string calldata serviceName) external view returns (address) {
    bytes32 serviceNameHash = _calculateNameHash(serviceName);
    return _externalServices[serviceNameHash];
  }

  /** @custom:see IAddressBook.getAction */
  function getAction(string calldata actionName) external view returns (address) {
    bytes32 actionNameHash = _calculateNameHash(actionName);
    return _actions[actionNameHash];
  }

  /** @custom:see IAddressBook.getExternalServiceByHash */
  function getExternalServiceByHash(bytes32 serviceHash) external view returns (address) {
    return _externalServices[serviceHash];
  }

  /** @custom:see IAddressBook.getActionByHash */
  function getActionByHash(bytes32 actionHash) external view returns (address) {
    return _actions[actionHash];
  }

  /** @custom:see IAddressBook.calculateNameHash */
  function calculateNameHash(string calldata name) external pure returns (bytes32) {
    return _calculateNameHash(name);
  }

  /// INTERNAL FUNCTIONS
  function _calculateNameHash(string calldata name) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked(name));
  }
}
