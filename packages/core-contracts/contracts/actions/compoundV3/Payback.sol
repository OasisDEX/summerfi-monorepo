// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.15;

import {Executable} from '../../common/Executable.sol';
import {UseStore, Write, Read} from '../../common/UseStore.sol';
import {OperationStorage} from '../../../core/OperationStorage.sol';
import {PaybackData} from '../../../core/types/CompoundV3.sol';
import {CometInterface} from '../../../interfaces/compoundV3/CometInterface.sol';

/**
 * @title Payback | Compound V3 Action contract
 * @notice Pays back a specified amount to Compound V3's lending pool
 */
contract CompoundV3Payback is Executable, UseStore {
  using Write for OperationStorage;
  using Read for OperationStorage;

  constructor(address _registry) UseStore(_registry) {}

  /**
   * @dev Look at UseStore.sol to get additional info on paramsMapping.
   * @dev The paybackAll flag - when passed - will signal the user wants to repay the full debt balance for a given asset
   * @param data Encoded calldata that conforms to the PaybackData struct
   * @param data.comet The address of the Comet contract
   * @param data.asset The address of the asset to pay back
   * @param data.amount The amount to pay back
   * @param data.paybackAll Flag to pay back the full debt balance
   * @param paramsMap Maps operation storage values by index (index offset by +1) to execute calldata params
   */
  function execute(bytes calldata data, uint8[] memory paramsMap) external payable override {
    PaybackData memory payback = parseInputs(data);

    payback.amount = store().readUint(bytes32(payback.amount), paramsMap[1], address(this));
    uint256 paybackAmount = payback.paybackAll ? type(uint256).max : payback.amount;
    uint256 balanceBefore = IERC20(payback.asset).balanceOf(address(this));
    CometInterface(payback.cometAddress).supply(payback.asset, paybackAmount);
    uint256 balanceAfter = IERC20(payback.asset).balanceOf(address(this));
    uint256 paybackAmount = balanceBefore - balanceAfter;

    store().write(bytes32(paybackAmount));
  }

  function parseInputs(bytes memory _callData) public pure returns (PaybackData memory params) {
    return abi.decode(_callData, (PaybackData));
  }
}
